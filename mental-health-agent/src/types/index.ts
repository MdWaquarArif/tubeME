import { z } from 'zod';

export const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.date().optional(),
});

export const SessionSchema = z.object({
  sessionId: z.string(),
  userId: z.string(),
  messages: z.array(MessageSchema),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CrisisAssessmentSchema = z.object({
  riskLevel: z.enum(['none', 'low', 'medium', 'high', 'critical']),
  indicators: z.array(z.string()),
  recommendedAction: z.string(),
  requiresImmediateIntervention: z.boolean(),
});

export const MoodEntrySchema = z.object({
  userId: z.string(),
  mood: z.enum(['very_poor', 'poor', 'neutral', 'good', 'excellent']),
  notes: z.string().optional(),
  timestamp: z.date(),
});

export const ResourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum(['crisis', 'therapy', 'support_group', 'self_help', 'emergency']),
  url: z.string().optional(),
  phone: z.string().optional(),
  available24_7: z.boolean(),
});

export type Message = z.infer<typeof MessageSchema>;
export type Session = z.infer<typeof SessionSchema>;
export type CrisisAssessment = z.infer<typeof CrisisAssessmentSchema>;
export type MoodEntry = z.infer<typeof MoodEntrySchema>;
export type Resource = z.infer<typeof ResourceSchema>;

export interface AgentConfig {
  name: string;
  role: string;
  systemPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface MemoryEntry {
  key: string;
  value: any;
  timestamp: Date;
  expiresAt?: Date;
}

export interface AgentResponse {
  content: string;
  metadata?: Record<string, any>;
  requiresFollowUp?: boolean;
}
