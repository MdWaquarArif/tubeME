import { BaseAgent } from './BaseAgent.js';
import { AgentResponse } from '../types/index.js';
import { crisisResources, searchResources, getResourcesByCategory } from '../tools/crisis-resources.js';

export class ResourceAgent extends BaseAgent {
  constructor(apiKey: string) {
    super(
      {
        name: 'ResourceAgent',
        role: 'Mental Health Resource Recommendation',
        systemPrompt: `You are a mental health resource specialist. Your role is to:
1. Recommend appropriate mental health resources based on user needs
2. Provide information about therapy, support groups, and self-help tools
3. Match resources to specific situations and preferences
4. Explain how to access different types of support

Available resource categories:
- crisis: Immediate crisis intervention
- therapy: Professional therapy services
- support_group: Peer support and community
- self_help: Apps, books, and self-guided resources
- emergency: Emergency services

When recommending resources:
- Consider urgency and severity
- Match to user's specific needs
- Provide clear next steps
- Include multiple options when possible`,
        temperature: 0.5,
        maxTokens: 768,
      },
      apiKey
    );
  }

  async process(input: string, context?: any): Promise<AgentResponse> {
    const messages = [
      {
        role: 'user' as const,
        content: `Based on this request, recommend appropriate mental health resources:\n\n"${input}"\n\nAvailable resources:\n${JSON.stringify(crisisResources, null, 2)}`,
      },
    ];

    const llmResponse = await this.callLLM(messages);
    
    // Extract keywords to find relevant resources
    const keywords = input.toLowerCase();
    let relevantResources = [];
    
    if (keywords.includes('crisis') || keywords.includes('emergency') || keywords.includes('suicide')) {
      relevantResources = getResourcesByCategory('crisis');
    } else if (keywords.includes('therapy') || keywords.includes('therapist') || keywords.includes('counseling')) {
      relevantResources = getResourcesByCategory('therapy');
    } else if (keywords.includes('support group') || keywords.includes('community')) {
      relevantResources = getResourcesByCategory('support_group');
    } else if (keywords.includes('app') || keywords.includes('meditation') || keywords.includes('self-help')) {
      relevantResources = getResourcesByCategory('self_help');
    } else {
      relevantResources = searchResources(input);
    }

    let content = llmResponse + '\n\n📚 Recommended Resources:\n\n';
    
    relevantResources.slice(0, 3).forEach(resource => {
      content += `**${resource.title}**\n`;
      content += `${resource.description}\n`;
      if (resource.phone) {
        content += `📞 ${resource.phone}\n`;
      }
      if (resource.url) {
        content += `🔗 ${resource.url}\n`;
      }
      if (resource.available24_7) {
        content += `⏰ Available 24/7\n`;
      }
      content += '\n';
    });

    return {
      content,
      metadata: { recommendedResources: relevantResources },
      requiresFollowUp: false,
    };
  }
}
