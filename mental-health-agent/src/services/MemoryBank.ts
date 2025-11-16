import { MemoryEntry } from '../types/index.js';
import * as fs from 'fs/promises';
import * as path from 'path';

export class MemoryBank {
  private memories: Map<string, MemoryEntry> = new Map();
  private persistencePath: string;

  constructor(persistencePath: string = './memory-bank') {
    this.persistencePath = persistencePath;
    this.initializePersistence();
  }

  private async initializePersistence(): Promise<void> {
    try {
      await fs.mkdir(this.persistencePath, { recursive: true });
      await this.loadMemories();
    } catch (error) {
      console.error('Failed to initialize memory bank:', error);
    }
  }

  private async loadMemories(): Promise<void> {
    try {
      const filePath = path.join(this.persistencePath, 'memories.json');
      const data = await fs.readFile(filePath, 'utf-8');
      const memoriesArray = JSON.parse(data, (key, value) => {
        if (key === 'timestamp' || key === 'expiresAt') {
          return value ? new Date(value) : undefined;
        }
        return value;
      });
      this.memories = new Map(memoriesArray.map((m: MemoryEntry) => [m.key, m]));
      console.log(`Loaded ${this.memories.size} memories from disk`);
    } catch (error) {
      console.log('No existing memories found, starting fresh');
    }
  }

  private async persistMemories(): Promise<void> {
    try {
      const filePath = path.join(this.persistencePath, 'memories.json');
      const memoriesArray = Array.from(this.memories.values());
      await fs.writeFile(filePath, JSON.stringify(memoriesArray, null, 2));
    } catch (error) {
      console.error('Failed to persist memories:', error);
    }
  }

  async store(key: string, value: any, expiresInMs?: number): Promise<void> {
    const entry: MemoryEntry = {
      key,
      value,
      timestamp: new Date(),
      expiresAt: expiresInMs ? new Date(Date.now() + expiresInMs) : undefined,
    };
    this.memories.set(key, entry);
    await this.persistMemories();
  }

  async retrieve(key: string): Promise<any | null> {
    const entry = this.memories.get(key);
    if (!entry) {
      return null;
    }
    if (entry.expiresAt && entry.expiresAt < new Date()) {
      this.memories.delete(key);
      await this.persistMemories();
      return null;
    }
    return entry.value;
  }

  async search(pattern: string): Promise<MemoryEntry[]> {
    const results: MemoryEntry[] = [];
    for (const entry of this.memories.values()) {
      if (entry.key.includes(pattern) || JSON.stringify(entry.value).includes(pattern)) {
        if (!entry.expiresAt || entry.expiresAt > new Date()) {
          results.push(entry);
        }
      }
    }
    return results;
  }

  async delete(key: string): Promise<void> {
    this.memories.delete(key);
    await this.persistMemories();
  }

  async clear(): Promise<void> {
    this.memories.clear();
    await this.persistMemories();
  }

  async getUserContext(userId: string): Promise<any> {
    const userMemories = await this.search(`user:${userId}`);
    return userMemories.reduce((acc, entry) => {
      const keyParts = entry.key.split(':');
      if (keyParts.length > 2) {
        acc[keyParts[2]] = entry.value;
      }
      return acc;
    }, {} as Record<string, any>);
  }

  async storeUserContext(userId: string, contextKey: string, value: any): Promise<void> {
    await this.store(`user:${userId}:${contextKey}`, value);
  }
}
