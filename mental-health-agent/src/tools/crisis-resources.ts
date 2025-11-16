import { Resource } from '../types/index.js';

export const crisisResources: Resource[] = [
  {
    id: 'suicide-prevention-lifeline',
    title: 'National Suicide Prevention Lifeline',
    description: '24/7 free and confidential support for people in distress, prevention and crisis resources.',
    category: 'crisis',
    phone: '988',
    available24_7: true,
  },
  {
    id: 'crisis-text-line',
    title: 'Crisis Text Line',
    description: 'Free 24/7 support for those in crisis. Text HOME to 741741.',
    category: 'crisis',
    phone: '741741',
    available24_7: true,
  },
  {
    id: 'samhsa-helpline',
    title: 'SAMHSA National Helpline',
    description: 'Treatment referral and information service for mental health and substance use disorders.',
    category: 'crisis',
    phone: '1-800-662-4357',
    available24_7: true,
  },
  {
    id: 'nami-helpline',
    title: 'NAMI HelpLine',
    description: 'Information, resource referrals and support for mental health questions.',
    category: 'support_group',
    phone: '1-800-950-6264',
    available24_7: false,
  },
  {
    id: 'betterhelp',
    title: 'BetterHelp',
    description: 'Online therapy platform connecting you with licensed therapists.',
    category: 'therapy',
    url: 'https://www.betterhelp.com',
    available24_7: false,
  },
  {
    id: 'talkspace',
    title: 'Talkspace',
    description: 'Online therapy with licensed therapists via text, audio, and video.',
    category: 'therapy',
    url: 'https://www.talkspace.com',
    available24_7: false,
  },
  {
    id: 'headspace',
    title: 'Headspace',
    description: 'Meditation and mindfulness app for mental wellness.',
    category: 'self_help',
    url: 'https://www.headspace.com',
    available24_7: true,
  },
  {
    id: 'calm',
    title: 'Calm',
    description: 'App for meditation, sleep, and relaxation.',
    category: 'self_help',
    url: 'https://www.calm.com',
    available24_7: true,
  },
  {
    id: 'emergency-911',
    title: 'Emergency Services',
    description: 'For immediate life-threatening emergencies.',
    category: 'emergency',
    phone: '911',
    available24_7: true,
  },
];

export function getResourcesByCategory(category: Resource['category']): Resource[] {
  return crisisResources.filter(r => r.category === category);
}

export function getEmergencyResources(): Resource[] {
  return crisisResources.filter(r => r.category === 'crisis' || r.category === 'emergency');
}

export function searchResources(query: string): Resource[] {
  const lowerQuery = query.toLowerCase();
  return crisisResources.filter(
    r =>
      r.title.toLowerCase().includes(lowerQuery) ||
      r.description.toLowerCase().includes(lowerQuery)
  );
}
