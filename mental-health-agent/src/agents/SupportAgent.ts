import { BaseAgent } from './BaseAgent.js';
import { AgentResponse, Message } from '../types/index.js';

export class SupportAgent extends BaseAgent {
  constructor(apiKey: string) {
    super(
      {
        name: 'SupportAgent',
        role: 'Emotional Support and Active Listening',
        systemPrompt: `You are a compassionate mental health support agent. Your role is to:
1. Provide empathetic, non-judgmental emotional support
2. Practice active listening and validation
3. Help users explore their feelings and thoughts
4. Encourage healthy coping strategies
5. Never diagnose or provide medical advice
6. Always maintain appropriate boundaries

Guidelines:
- Use reflective listening techniques
- Validate emotions without judgment
- Ask open-ended questions to encourage expression
- Suggest evidence-based coping strategies when appropriate
- Recognize when professional help is needed
- Be warm, genuine, and supportive
- Keep responses concise but meaningful (2-4 sentences typically)

Remember: You are not a replacement for professional therapy, but a supportive companion.`,
        temperature: 0.8,
        maxTokens: 512,
      },
      apiKey
    );
  }

  async process(input: string, context?: any): Promise<AgentResponse> {
    const conversationHistory: Message[] = context?.recentMessages || [];
    
    const messages: Message[] = [
      ...conversationHistory.slice(-6),
      {
        role: 'user',
        content: input,
      },
    ];

    const response = await this.callLLM(messages);

    return {
      content: response,
      requiresFollowUp: false,
    };
  }
}
