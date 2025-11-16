import { AgentOrchestrator } from './orchestrator/AgentOrchestrator.js';
import * as dotenv from 'dotenv';
import * as readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY not found in environment variables');
    console.log('Please create a .env file with your API key:');
    console.log('ANTHROPIC_API_KEY=your_key_here');
    process.exit(1);
  }

  console.log('\n🏥 Mental Health Support Agent - Interactive Test\n');
  console.log('='.repeat(60));
  console.log('This is a safe space to talk about your mental health.');
  console.log('Type "quit" to exit, "mood" to log your mood, "insights" for mood insights');
  console.log('='.repeat(60));
  console.log();

  const orchestrator = new AgentOrchestrator(apiKey);
  const userId = 'test_user_' + Date.now();
  const sessionId = 'test_session_' + Date.now();

  const askQuestion = () => {
    rl.question('You: ', async (input) => {
      const message = input.trim();

      if (message.toLowerCase() === 'quit') {
        console.log('\n👋 Take care of yourself. Remember, help is always available.');
        rl.close();
        process.exit(0);
      }

      if (message.toLowerCase() === 'mood') {
        rl.question('How are you feeling? (very_poor/poor/neutral/good/excellent): ', async (mood) => {
          rl.question('Any notes? (optional): ', async (notes) => {
            await orchestrator.logMood(userId, mood.trim(), notes.trim() || undefined);
            console.log('✅ Mood logged!\n');
            askQuestion();
          });
        });
        return;
      }

      if (message.toLowerCase() === 'insights') {
        const insights = await orchestrator.getMoodInsights(userId);
        console.log(`\nAgent: ${insights}\n`);
        askQuestion();
        return;
      }

      if (!message) {
        askQuestion();
        return;
      }

      try {
        console.log('\n[Processing...]\n');
        const result = await orchestrator.processMessage(userId, sessionId, message);
        
        console.log(`Agent: ${result.response}\n`);
        
        if (result.metadata?.riskLevel && result.metadata.riskLevel !== 'none') {
          console.log(`⚠️  Risk Level: ${result.metadata.riskLevel}\n`);
        }
        
      } catch (error) {
        console.error('❌ Error:', error);
      }

      askQuestion();
    });
  };

  askQuestion();
}

main().catch(console.error);
