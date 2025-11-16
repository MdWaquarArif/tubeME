import { CrisisDetectionAgent } from '../agents/CrisisDetectionAgent.js';
import { SupportAgent } from '../agents/SupportAgent.js';
import { ResourceAgent } from '../agents/ResourceAgent.js';
import { InMemorySessionService } from '../services/SessionService.js';
import { MemoryBank } from '../services/MemoryBank.js';
import { MoodTracker } from '../tools/mood-tracker.js';
import { AgentResponse, Message } from '../types/index.js';

export class AgentOrchestrator {
  private crisisAgent: CrisisDetectionAgent;
  private supportAgent: SupportAgent;
  private resourceAgent: ResourceAgent;
  private sessionService: InMemorySessionService;
  private memoryBank: MemoryBank;
  private moodTracker: MoodTracker;

  constructor(apiKey: string) {
    this.crisisAgent = new CrisisDetectionAgent(apiKey);
    this.supportAgent = new SupportAgent(apiKey);
    this.resourceAgent = new ResourceAgent(apiKey);
    this.sessionService = new InMemorySessionService();
    this.memoryBank = new MemoryBank();
    this.moodTracker = new MoodTracker();
  }

  async processMessage(
    userId: string,
    sessionId: string,
    message: string
  ): Promise<{ response: string; metadata?: any }> {
    console.log(`\n[Orchestrator] Processing message for user ${userId}`);
    
    // Get or create session
    let session = await this.sessionService.getSession(sessionId);
    if (!session) {
      session = await this.sessionService.createSession(userId);
      sessionId = session.sessionId;
    }

    // Add user message to session
    await this.sessionService.addMessage(sessionId, {
      role: 'user',
      content: message,
    });

    // Step 1: Crisis Detection (runs in parallel with context retrieval)
    console.log('[Orchestrator] Running crisis detection...');
    const crisisAssessment = await this.crisisAgent.process(message);
    
    const riskLevel = crisisAssessment.metadata?.assessment?.riskLevel || 'none';
    console.log(`[Orchestrator] Crisis risk level: ${riskLevel}`);

    // If critical crisis detected, return immediately with crisis resources
    if (riskLevel === 'critical' || riskLevel === 'high') {
      console.log('[Orchestrator] High/Critical risk detected - returning crisis response');
      await this.sessionService.addMessage(sessionId, {
        role: 'assistant',
        content: crisisAssessment.content,
      });
      
      // Log this critical event
      await this.memoryBank.storeUserContext(userId, 'last_crisis_event', {
        timestamp: new Date(),
        riskLevel,
        message: message.substring(0, 100),
      });

      return {
        response: crisisAssessment.content,
        metadata: {
          riskLevel,
          requiresFollowUp: true,
          agentUsed: 'crisis',
        },
      };
    }

    // Step 2: Determine if user is asking for resources
    const isResourceRequest = this.detectResourceRequest(message);
    
    let finalResponse: AgentResponse;
    let agentUsed: string;

    if (isResourceRequest) {
      // Use Resource Agent
      console.log('[Orchestrator] Resource request detected - using ResourceAgent');
      finalResponse = await this.resourceAgent.process(message);
      agentUsed = 'resource';
    } else {
      // Use Support Agent with conversation history
      console.log('[Orchestrator] Using SupportAgent for emotional support');
      const recentMessages = await this.sessionService.getRecentMessages(sessionId, 6);
      const userContext = await this.memoryBank.getUserContext(userId);
      
      finalResponse = await this.supportAgent.process(message, {
        recentMessages,
        userContext,
      });
      agentUsed = 'support';
    }

    // Add assistant response to session
    await this.sessionService.addMessage(sessionId, {
      role: 'assistant',
      content: finalResponse.content,
    });

    // Update user context in memory
    await this.memoryBank.storeUserContext(userId, 'last_interaction', new Date());
    await this.memoryBank.storeUserContext(userId, 'message_count', 
      ((await this.memoryBank.retrieve(`user:${userId}:message_count`)) || 0) + 1
    );

    console.log(`[Orchestrator] Response generated using ${agentUsed} agent`);

    return {
      response: finalResponse.content,
      metadata: {
        riskLevel,
        agentUsed,
        sessionId,
      },
    };
  }

  private detectResourceRequest(message: string): boolean {
    const resourceKeywords = [
      'resource',
      'help line',
      'hotline',
      'therapist',
      'therapy',
      'counselor',
      'support group',
      'where can i',
      'how do i find',
      'recommend',
      'suggestion',
      'app',
      'service',
    ];

    const lowerMessage = message.toLowerCase();
    return resourceKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  async logMood(userId: string, mood: string, notes?: string): Promise<void> {
    await this.moodTracker.logMood({
      userId,
      mood: mood as any,
      notes,
      timestamp: new Date(),
    });
  }

  async getMoodInsights(userId: string): Promise<string> {
    const trend = await this.moodTracker.getMoodTrend(userId, 7);
    const avgMood = await this.moodTracker.getAverageMood(userId, 7);
    const history = await this.moodTracker.getUserMoodHistory(userId, 7);

    let insights = `📊 Your Mood Insights (Last 7 Days)\n\n`;
    insights += `Trend: ${trend}\n`;
    insights += `Average Mood: ${avgMood.toFixed(1)}/5\n`;
    insights += `Entries: ${history.length}\n\n`;

    if (trend === 'declining') {
      insights += `I notice your mood has been declining. Would you like to talk about what's been happening?`;
    } else if (trend === 'improving') {
      insights += `It's great to see your mood improving! Keep up the positive momentum.`;
    } else {
      insights += `Your mood has been relatively stable. How are you feeling today?`;
    }

    return insights;
  }

  getSessionService(): InMemorySessionService {
    return this.sessionService;
  }

  getMemoryBank(): MemoryBank {
    return this.memoryBank;
  }

  getMoodTracker(): MoodTracker {
    return this.moodTracker;
  }
}
