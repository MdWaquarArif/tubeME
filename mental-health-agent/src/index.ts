import express from 'express';
import { WebSocketServer } from 'ws';
import { AgentOrchestrator } from './orchestrator/AgentOrchestrator.js';
import * as dotenv from 'dotenv';
import * as http from 'http';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Initialize orchestrator
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('❌ ANTHROPIC_API_KEY not found in environment variables');
  process.exit(1);
}

const orchestrator = new AgentOrchestrator(apiKey);

// REST API endpoints
app.post('/api/chat', async (req, res) => {
  try {
    const { userId, sessionId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }

    const result = await orchestrator.processMessage(
      userId,
      sessionId || `session_${Date.now()}`,
      message
    );

    res.json(result);
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/mood', async (req, res) => {
  try {
    const { userId, mood, notes } = req.body;

    if (!userId || !mood) {
      return res.status(400).json({ error: 'userId and mood are required' });
    }

    await orchestrator.logMood(userId, mood, notes);
    res.json({ success: true });
  } catch (error) {
    console.error('Error logging mood:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/mood/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const insights = await orchestrator.getMoodInsights(userId);
    res.json({ insights });
  } catch (error) {
    console.error('Error getting mood insights:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/sessions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await orchestrator.getSessionService().getAllSessions(userId);
    res.json({ sessions });
  } catch (error) {
    console.error('Error getting sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Create HTTP server
const server = http.createServer(app);

// WebSocket server for real-time chat
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'chat') {
        const result = await orchestrator.processMessage(
          message.userId,
          message.sessionId || `session_${Date.now()}`,
          message.content
        );
        
        ws.send(JSON.stringify({
          type: 'response',
          ...result,
        }));
      }
    } catch (error) {
      console.error('WebSocket error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        error: 'Failed to process message',
      }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

server.listen(port, () => {
  console.log(`\n🏥 Mental Health Support Agent System`);
  console.log(`=`.repeat(50));
  console.log(`✅ Server running on http://localhost:${port}`);
  console.log(`✅ WebSocket available at ws://localhost:${port}/ws`);
  console.log(`✅ Health check: http://localhost:${port}/health`);
  console.log(`=`.repeat(50));
  console.log(`\nAPI Endpoints:`);
  console.log(`  POST /api/chat - Send a message`);
  console.log(`  POST /api/mood - Log mood entry`);
  console.log(`  GET  /api/mood/:userId - Get mood insights`);
  console.log(`  GET  /api/sessions/:userId - Get user sessions`);
  console.log(`\n💡 Tip: Run 'npm run evaluate' to test the agent\n`);
});
