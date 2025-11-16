import Anthropic from '@anthropic-ai/sdk';
import { AgentConfig, AgentResponse, Message } from '../types/index.js';

export abstract class BaseAgent {
  protected client: Anthropic;
  protected config: AgentConfig;

  constructor(config: AgentConfig, apiKey: string) {
    this.config = config;
    this.client = new Anthropic({ apiKey });
  }

  protected async callLLM(messages: Message[], systemPrompt?: string): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: this.config.maxTokens || 1024,
        temperature: this.config.temperature || 0.7,
        system: systemPrompt || this.config.systemPrompt,
        messages: messages.map(m => ({
          role: m.role === 'system' ? 'assistant' : m.role,
          content: m.content,
        })),
      });

      const content = response.content[0];
      return content.type === 'text' ? content.text : '';
    } catch (error) {
      console.error(`Error calling LLM for ${this.config.name}:`, error);
      throw error;
    }
  }

  abstract process(input: string, context?: any): Promise<AgentResponse>;

  getName(): string {
    return this.config.name;
  }

  getRole(): string {
    return this.config.role;
  }
}
