import { BaseAgent } from './BaseAgent.js';
import { AgentResponse, CrisisAssessment } from '../types/index.js';
import { getEmergencyResources } from '../tools/crisis-resources.js';

export class CrisisDetectionAgent extends BaseAgent {
  constructor(apiKey: string) {
    super(
      {
        name: 'CrisisDetectionAgent',
        role: 'Crisis Detection and Assessment',
        systemPrompt: `You are a crisis detection specialist. Your role is to:
1. Analyze user messages for signs of crisis, self-harm, or suicidal ideation
2. Assess the severity and urgency of the situation
3. Provide immediate safety recommendations
4. Never provide therapy or counseling - only crisis assessment

Crisis indicators include:
- Explicit mentions of self-harm or suicide
- Expressions of hopelessness or worthlessness
- Talk of saying goodbye or giving away possessions
- Sudden mood changes or withdrawal
- Substance abuse mentions
- Recent trauma or loss

Respond with a JSON object containing:
{
  "riskLevel": "none" | "low" | "medium" | "high" | "critical",
  "indicators": ["list of detected indicators"],
  "recommendedAction": "specific action to take",
  "requiresImmediateIntervention": boolean
}`,
        temperature: 0.3,
        maxTokens: 512,
      },
      apiKey
    );
  }

  async process(input: string, context?: any): Promise<AgentResponse> {
    const messages = [
      {
        role: 'user' as const,
        content: `Analyze this message for crisis indicators:\n\n"${input}"\n\nProvide assessment as JSON.`,
      },
    ];

    const response = await this.callLLM(messages);
    
    try {
      const assessment: CrisisAssessment = JSON.parse(response);
      
      let content = `Crisis Assessment: ${assessment.riskLevel.toUpperCase()}\n`;
      
      if (assessment.indicators.length > 0) {
        content += `\nDetected Indicators:\n${assessment.indicators.map(i => `- ${i}`).join('\n')}`;
      }
      
      content += `\n\nRecommended Action: ${assessment.recommendedAction}`;
      
      if (assessment.requiresImmediateIntervention) {
        const emergencyResources = getEmergencyResources();
        content += '\n\n🚨 IMMEDIATE HELP AVAILABLE:\n';
        emergencyResources.forEach(resource => {
          content += `\n${resource.title}`;
          if (resource.phone) {
            content += ` - Call/Text: ${resource.phone}`;
          }
          content += `\n${resource.description}`;
        });
      }
      
      return {
        content,
        metadata: { assessment },
        requiresFollowUp: assessment.riskLevel !== 'none',
      };
    } catch (error) {
      console.error('Failed to parse crisis assessment:', error);
      return {
        content: 'Unable to complete crisis assessment. If you are in immediate danger, please call 911 or text 988.',
        metadata: { error: 'parse_error' },
        requiresFollowUp: true,
      };
    }
  }
}
