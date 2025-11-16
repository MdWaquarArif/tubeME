import { MoodEntry } from '../types/index.js';
import * as fs from 'fs/promises';
import * as path from 'path';

export class MoodTracker {
  private entries: Map<string, MoodEntry[]> = new Map();
  private persistencePath: string;

  constructor(persistencePath: string = './mood-data') {
    this.persistencePath = persistencePath;
    this.initializePersistence();
  }

  private async initializePersistence(): Promise<void> {
    try {
      await fs.mkdir(this.persistencePath, { recursive: true });
      await this.loadEntries();
    } catch (error) {
      console.error('Failed to initialize mood tracker:', error);
    }
  }

  private async loadEntries(): Promise<void> {
    try {
      const filePath = path.join(this.persistencePath, 'mood-entries.json');
      const data = await fs.readFile(filePath, 'utf-8');
      const entriesArray = JSON.parse(data, (key, value) => {
        if (key === 'timestamp') {
          return new Date(value);
        }
        return value;
      });
      this.entries = new Map(Object.entries(entriesArray));
      console.log(`Loaded mood entries for ${this.entries.size} users`);
    } catch (error) {
      console.log('No existing mood entries found, starting fresh');
    }
  }

  private async persistEntries(): Promise<void> {
    try {
      const filePath = path.join(this.persistencePath, 'mood-entries.json');
      const entriesObject = Object.fromEntries(this.entries);
      await fs.writeFile(filePath, JSON.stringify(entriesObject, null, 2));
    } catch (error) {
      console.error('Failed to persist mood entries:', error);
    }
  }

  async logMood(entry: MoodEntry): Promise<void> {
    const userEntries = this.entries.get(entry.userId) || [];
    userEntries.push(entry);
    this.entries.set(entry.userId, userEntries);
    await this.persistEntries();
  }

  async getUserMoodHistory(userId: string, days: number = 30): Promise<MoodEntry[]> {
    const userEntries = this.entries.get(userId) || [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return userEntries.filter(e => e.timestamp >= cutoffDate);
  }

  async getMoodTrend(userId: string, days: number = 7): Promise<string> {
    const history = await this.getUserMoodHistory(userId, days);
    if (history.length === 0) {
      return 'No mood data available';
    }

    const moodValues: Record<string, number> = {
      very_poor: 1,
      poor: 2,
      neutral: 3,
      good: 4,
      excellent: 5,
    };

    const recentMoods = history.slice(-days);
    const avgMood = recentMoods.reduce((sum, e) => sum + moodValues[e.mood], 0) / recentMoods.length;

    if (recentMoods.length >= 2) {
      const firstHalf = recentMoods.slice(0, Math.floor(recentMoods.length / 2));
      const secondHalf = recentMoods.slice(Math.floor(recentMoods.length / 2));
      
      const firstAvg = firstHalf.reduce((sum, e) => sum + moodValues[e.mood], 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, e) => sum + moodValues[e.mood], 0) / secondHalf.length;

      if (secondAvg > firstAvg + 0.5) {
        return 'improving';
      } else if (secondAvg < firstAvg - 0.5) {
        return 'declining';
      }
    }

    return 'stable';
  }

  async getAverageMood(userId: string, days: number = 7): Promise<number> {
    const history = await this.getUserMoodHistory(userId, days);
    if (history.length === 0) {
      return 3; // neutral
    }

    const moodValues: Record<string, number> = {
      very_poor: 1,
      poor: 2,
      neutral: 3,
      good: 4,
      excellent: 5,
    };

    return history.reduce((sum, e) => sum + moodValues[e.mood], 0) / history.length;
  }
}
