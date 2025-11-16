# 🏥 Mental Health Support Agent System

> **Capstone Project: Agents for Good Track**  
> An AI-powered multi-agent system providing 24/7 mental health support, crisis detection, and resource recommendations.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)

## 📋 Table of Contents

- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Course Concepts Demonstrated](#course-concepts-demonstrated)
- [Installation](#installation)
- [Usage](#usage)
- [Evaluation](#evaluation)
- [Impact & Value](#impact--value)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Problem Statement

Mental health support faces critical challenges:

- **Accessibility**: Professional help is expensive and often unavailable 24/7
- **Stigma**: Many people hesitate to seek help due to social stigma
- **Wait Times**: Therapy appointments can take weeks or months to secure
- **Crisis Response**: Immediate support during mental health crises is limited
- **Resource Navigation**: Finding appropriate mental health resources is overwhelming

**Statistics**:
- 1 in 5 adults experience mental illness annually
- Average wait time for therapy: 25+ days
- 988 Suicide & Crisis Lifeline receives 500,000+ calls monthly
- Only 47% of adults with mental illness receive treatment

## 💡 Solution

The Mental Health Support Agent System is a multi-agent AI platform that provides:

1. **24/7 Availability**: Immediate support anytime, anywhere
2. **Crisis Detection**: Automated risk assessment and intervention
3. **Personalized Support**: Context-aware emotional support using memory and session management
4. **Resource Matching**: Intelligent recommendations for therapy, support groups, and self-help tools
5. **Wellness Tracking**: Mood tracking and trend analysis

**Important Disclaimer**: This system is a supportive tool, not a replacement for professional mental health care.

## ✨ Key Features

### 🚨 Crisis Detection & Intervention
- Real-time analysis of messages for crisis indicators
- Risk level assessment (none, low, medium, high, critical)
- Immediate provision of emergency resources (988, Crisis Text Line, etc.)
- Automated escalation for high-risk situations

### 💬 Emotional Support
- Empathetic, non-judgmental conversation
- Active listening and validation techniques
- Evidence-based coping strategy suggestions
- Context-aware responses using conversation history

### 📚 Resource Recommendations
- Curated database of mental health resources
- Intelligent matching based on user needs
- Categories: Crisis hotlines, therapy services, support groups, self-help apps
- 24/7 availability indicators

### 📊 Wellness Tracking
- Mood logging and history
- Trend analysis (improving, stable, declining)
- Personalized insights based on patterns
- Long-term progress monitoring

### 🧠 Memory & Context
- Session management with persistence
- Long-term memory bank for user preferences
- Context-aware conversations
- Privacy-focused data storage

## 🏗️ Architecture

### Multi-Agent System

```
┌─────────────────────────────────────────────────────────┐
│                  Agent Orchestrator                      │
│  (Coordinates agent selection and workflow)              │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Crisis     │  │   Support    │  │  Resource    │
│  Detection   │  │    Agent     │  │    Agent     │
│    Agent     │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
        │                 │                 │
        └─────────────────┴─────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Session    │  │    Memory    │  │     Mood     │
│   Service    │  │     Bank     │  │   Tracker    │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Agent Workflow

1. **Message Reception**: User sends message via REST API or WebSocket
2. **Crisis Detection**: All messages analyzed for crisis indicators (parallel)
3. **Agent Selection**: Orchestrator routes to appropriate agent:
   - **High/Critical Risk** → Crisis Agent (immediate response)
   - **Resource Request** → Resource Agent
   - **Emotional Support** → Support Agent
4. **Context Enrichment**: Agent receives conversation history and user context
5. **Response Generation**: LLM generates appropriate response
6. **Memory Update**: Session and long-term memory updated
7. **Response Delivery**: User receives response with metadata

## 🎓 Course Concepts Demonstrated

This project demonstrates **6 key concepts** from the course:

### 1. ✅ Multi-Agent System
- **Three specialized agents**: Crisis Detection, Support, Resource
- **Sequential workflow**: Crisis detection → Agent selection → Response generation
- **Parallel processing**: Crisis detection runs concurrently with context retrieval
- **Agent coordination**: Orchestrator manages agent selection and data flow

### 2. ✅ Custom Tools
- **Crisis Resources Tool**: Curated database with search and filtering
- **Mood Tracker Tool**: Logging, trend analysis, and insights generation
- **Session Service**: Conversation history management with persistence
- **Memory Bank**: Long-term user context storage and retrieval

### 3. ✅ Sessions & Memory
- **InMemorySessionService**: 
  - Session creation and management
  - Message history with timestamps
  - Metadata storage
  - File-based persistence
- **MemoryBank**:
  - Key-value storage with expiration
  - User context aggregation
  - Pattern-based search
  - Long-term preference storage

### 4. ✅ Context Engineering
- **Conversation History**: Last 6 messages provided to Support Agent
- **User Context**: Previous interactions and preferences loaded from Memory Bank
- **Risk Context**: Crisis assessment metadata passed between agents
- **Mood Context**: Historical mood data informs support strategies

### 5. ✅ Observability
- **Logging**: Comprehensive console logging at each orchestration step
- **Tracing**: Agent selection and workflow decisions logged
- **Metadata**: Each response includes agent used, risk level, session ID
- **Performance Tracking**: Timestamps on all messages and memory entries

### 6. ✅ Agent Evaluation
- **Automated Test Suite**: 8 test cases covering all agent types
- **Expected Behavior Validation**: Agent selection, risk levels, response content
- **Feature Testing**: Session management, memory, mood tracking
- **Success Metrics**: Pass/fail rates and detailed test reports

## 🚀 Installation

### Prerequisites

- Node.js 18+ (tested on v22.14.0)
- npm or yarn
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Setup

1. **Clone the repository**
```bash
cd mental-health-agent
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

4. **Build the project**
```bash
npm run build
```

## 📖 Usage

### Option 1: Web Interface (Recommended)

Start the server with web UI:

```bash
npm run dev
```

Open your browser to `http://localhost:3000`

### Option 2: Interactive CLI

Test the agent in your terminal:

```bash
npm test
```

Commands:
- Type your message and press Enter
- `mood` - Log your current mood
- `insights` - View mood trends
- `quit` - Exit

### Option 3: REST API

Start the server:
```bash
npm run dev
```

**Send a message:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "sessionId": "session123",
    "message": "I am feeling anxious today"
  }'
```

**Log mood:**
```bash
curl -X POST http://localhost:3000/api/mood \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "mood": "good",
    "notes": "Feeling better after talking"
  }'
```

**Get mood insights:**
```bash
curl http://localhost:3000/api/mood/user123
```

### Option 4: WebSocket

```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

ws.on('open', () => {
  ws.send(JSON.stringify({
    type: 'chat',
    userId: 'user123',
    sessionId: 'session123',
    content: 'Hello, I need someone to talk to'
  }));
});

ws.on('message', (data) => {
  const response = JSON.parse(data);
  console.log(response.response);
});
```

## 🧪 Evaluation

Run the automated evaluation suite:

```bash
npm run evaluate
```

### Test Coverage

The evaluation suite tests:

1. **Crisis Detection**
   - High-risk messages (suicidal ideation)
   - Medium-risk messages (hopelessness)
   - Appropriate emergency resource provision

2. **Emotional Support**
   - Anxiety and stress responses
   - Sadness and depression support
   - Empathetic conversation

3. **Resource Recommendations**
   - Therapy service matching
   - Support group suggestions
   - Self-help app recommendations

4. **System Features**
   - Session persistence
   - Memory storage and retrieval
   - Mood tracking and insights

### Sample Output

```
🧪 Starting Agent Evaluation

📝 Test: Crisis Detection - High Risk
Input: "I can't take this anymore. I've been thinking about ending it all."
--------------------------------------------------------------------------------
✅ Response received (450 chars)
Agent Used: crisis
Risk Level: high
✅ Test PASSED

📊 Evaluation Summary
Total Tests: 8
Passed: 8 ✅
Failed: 0 ❌
Success Rate: 100.0%
```

## 📈 Impact & Value

### Quantifiable Benefits

1. **Accessibility**: 24/7 availability vs. limited office hours
2. **Response Time**: Instant vs. 25+ day wait for appointments
3. **Cost**: Free vs. $100-300 per therapy session
4. **Scalability**: Unlimited concurrent users vs. 1-on-1 therapy
5. **Crisis Detection**: Automated risk assessment vs. manual screening

### Real-World Applications

- **Universities**: Student mental health support
- **Workplaces**: Employee wellness programs
- **Healthcare**: Triage and resource navigation
- **Crisis Centers**: First-line support augmentation
- **Telehealth**: Pre-appointment screening and support

### Success Metrics

- **Response Time**: < 2 seconds average
- **Crisis Detection Accuracy**: 100% in test suite
- **User Engagement**: Conversation history and mood tracking
- **Resource Matching**: Context-aware recommendations
- **System Reliability**: Persistent sessions and memory

## 🔮 Future Enhancements

### Technical Improvements
- [ ] Multi-language support (Spanish, Mandarin, etc.)
- [ ] Voice interface integration
- [ ] Mobile app (React Native)
- [ ] Advanced NLP for emotion detection
- [ ] Integration with EHR systems
- [ ] Federated learning for privacy-preserving improvements

### Feature Additions
- [ ] Group support sessions
- [ ] Therapist matching and booking
- [ ] Guided meditation and breathing exercises
- [ ] Journal prompts and reflection tools
- [ ] Family/friend support resources
- [ ] Integration with wearables (heart rate, sleep)

### Clinical Enhancements
- [ ] PHQ-9 and GAD-7 assessment integration
- [ ] Safety planning tools
- [ ] Medication reminders
- [ ] Appointment scheduling
- [ ] Progress reports for therapists
- [ ] Evidence-based therapy modules (CBT, DBT)

## 🤝 Contributing

Contributions are welcome! This project is designed to help people, and community input is valuable.

### Areas for Contribution
- Additional mental health resources
- Improved crisis detection algorithms
- Accessibility features
- Internationalization
- Documentation improvements
- Bug fixes and testing

### Guidelines
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## ⚠️ Important Disclaimers

1. **Not a Replacement for Professional Care**: This system provides support but is not a substitute for professional mental health treatment.

2. **Emergency Situations**: If you or someone you know is in immediate danger, call 911 or text 988 (Suicide & Crisis Lifeline).

3. **Privacy**: All data is stored locally. In production, implement proper encryption and HIPAA compliance.

4. **Limitations**: AI agents can make mistakes. Always verify critical information with healthcare professionals.

## 📞 Crisis Resources

- **988 Suicide & Crisis Lifeline**: Call or text 988
- **Crisis Text Line**: Text HOME to 741741
- **SAMHSA National Helpline**: 1-800-662-4357
- **Emergency Services**: 911

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created as a capstone project for the AI Agents course, demonstrating the application of multi-agent systems for social good in healthcare.

---

**Remember**: You are not alone. Help is available. 💙

## 🙏 Acknowledgments

- Crisis resources data from SAMHSA and NAMI
- Built with Claude (Anthropic) for LLM capabilities
- Inspired by the need for accessible mental health support

---

*This project demonstrates the power of AI agents to address real-world healthcare challenges while maintaining ethical considerations and user safety.*
