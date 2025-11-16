# 🚀 Quick Start Guide

Get the Mental Health Support Agent running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Anthropic API key ([Get one free](https://console.anthropic.com/))

## Installation

```bash
# 1. Navigate to project directory
cd mental-health-agent

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env

# 4. Edit .env and add your API key
# ANTHROPIC_API_KEY=your_key_here
```

## Usage Options

### Option 1: Web Interface (Easiest)

```bash
npm run dev
```

Open http://localhost:3000 in your browser. Start chatting!

### Option 2: Interactive CLI

```bash
npm test
```

Type messages in your terminal. Commands:
- `mood` - Log your mood
- `insights` - View mood trends
- `quit` - Exit

### Option 3: Run Evaluation

```bash
npm run evaluate
```

Runs automated tests to verify all agents work correctly.

## Example Conversations

### Crisis Support
```
You: I'm feeling really hopeless and don't know what to do
Agent: [Provides crisis assessment and emergency resources]
```

### Emotional Support
```
You: I've been feeling anxious about work lately
Agent: [Offers empathetic support and coping strategies]
```

### Resource Request
```
You: Can you recommend a good therapy service?
Agent: [Suggests BetterHelp, Talkspace, and other resources]
```

## API Endpoints

### Send a message
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "message": "I need someone to talk to"
  }'
```

### Log mood
```bash
curl -X POST http://localhost:3000/api/mood \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "mood": "good",
    "notes": "Feeling better today"
  }'
```

### Get mood insights
```bash
curl http://localhost:3000/api/mood/user123
```

## Troubleshooting

### "ANTHROPIC_API_KEY not found"
- Make sure you created `.env` file
- Add your API key: `ANTHROPIC_API_KEY=sk-ant-...`

### Port 3000 already in use
- Change port in `.env`: `PORT=3001`
- Or stop other services using port 3000

### Dependencies not installing
- Update Node.js to version 18+
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## Next Steps

1. ✅ Try the web interface
2. ✅ Run the evaluation suite
3. ✅ Test the CLI interface
4. ✅ Explore the API endpoints
5. ✅ Read the full README.md
6. ✅ Check out SUBMISSION.md for technical details

## Need Help?

- 📖 Full documentation: [README.md](README.md)
- 🎓 Technical details: [SUBMISSION.md](SUBMISSION.md)
- 🐛 Found a bug? Open an issue on GitHub

## Emergency Resources

**If you're in crisis**:
- 📞 Call or text **988** (Suicide & Crisis Lifeline)
- 💬 Text **HOME** to **741741** (Crisis Text Line)
- 🚨 Call **911** for emergencies

---

**Remember**: This is a supportive tool, not a replacement for professional care. 💙
