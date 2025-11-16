import { Session, Message } from '../types/index.js';
import * as fs from 'fs/promises';
import * as path from 'path';

export class InMemorySessionService {
  private sessions: Map<string, Session> = new Map();
  private persistencePath: string;

  constructor(persistencePath: string = './sessions') {
    this.persistencePath = persistencePath;
    this.initializePersistence();
  }

  private async initializePersistence(): Promise<void> {
    try {
      await fs.mkdir(this.persistencePath, { recursive: true });
      await this.loadSessions();
    } catch (error) {
      console.error('Failed to initialize session persistence:', error);
    }
  }

  private async loadSessions(): Promise<void> {
    try {
      const files = await fs.readdir(this.persistencePath);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(this.persistencePath, file);
          const data = await fs.readFile(filePath, 'utf-8');
          const session = JSON.parse(data, (key, value) => {
            if (key === 'createdAt' || key === 'updatedAt' || key === 'timestamp') {
              return new Date(value);
            }
            return value;
          });
          this.sessions.set(session.sessionId, session);
        }
      }
      console.log(`Loaded ${this.sessions.size} sessions from disk`);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  }

  private async persistSession(session: Session): Promise<void> {
    try {
      const filePath = path.join(this.persistencePath, `${session.sessionId}.json`);
      await fs.writeFile(filePath, JSON.stringify(session, null, 2));
    } catch (error) {
      console.error('Failed to persist session:', error);
    }
  }

  async createSession(userId: string): Promise<Session> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session: Session = {
      sessionId,
      userId,
      messages: [],
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.sessions.set(sessionId, session);
    await this.persistSession(session);
    return session;
  }

  async getSession(sessionId: string): Promise<Session | null> {
    return this.sessions.get(sessionId) || null;
  }

  async addMessage(sessionId: string, message: Message): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    message.timestamp = message.timestamp || new Date();
    session.messages.push(message);
    session.updatedAt = new Date();
    await this.persistSession(session);
  }

  async updateMetadata(sessionId: string, metadata: Record<string, any>): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    session.metadata = { ...session.metadata, ...metadata };
    session.updatedAt = new Date();
    await this.persistSession(session);
  }

  async getRecentMessages(sessionId: string, count: number = 10): Promise<Message[]> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return [];
    }
    return session.messages.slice(-count);
  }

  async getAllSessions(userId: string): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(s => s.userId === userId);
  }

  async deleteSession(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
    try {
      const filePath = path.join(this.persistencePath, `${sessionId}.json`);
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Failed to delete session file:', error);
    }
  }
}
