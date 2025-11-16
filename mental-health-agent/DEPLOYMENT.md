# 🚀 Deployment Guide

This guide covers deploying the Mental Health Support Agent System to various platforms.

## Table of Contents
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Platforms](#cloud-platforms)
- [Environment Variables](#environment-variables)
- [Security Considerations](#security-considerations)
- [Monitoring & Maintenance](#monitoring--maintenance)

## Local Development

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Anthropic API key

### Setup
```bash
# Clone repository
git clone <repository-url>
cd mental-health-agent

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add ANTHROPIC_API_KEY

# Run in development mode
npm run dev
```

Access at: http://localhost:3000

## Production Deployment

### Build for Production
```bash
# Install dependencies
npm install --production

# Build TypeScript
npm run build

# Start production server
npm start
```

### Process Management (PM2)
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start dist/index.js --name mental-health-agent

# Configure auto-restart
pm2 startup
pm2 save

# Monitor
pm2 monit

# View logs
pm2 logs mental-health-agent
```

### Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

### SSL/TLS with Let's Encrypt
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## Docker Deployment

### Dockerfile
```dockerfile
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create directories for persistence
RUN mkdir -p sessions memory-bank mood-data

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  mental-health-agent:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - PORT=3000
    volumes:
      - ./sessions:/app/sessions
      - ./memory-bank:/app/memory-bank
      - ./mood-data:/app/mood-data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 5s

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - mental-health-agent
    restart: unless-stopped
```

### Build and Run
```bash
# Build image
docker build -t mental-health-agent .

# Run container
docker run -d \
  --name mental-health-agent \
  -p 3000:3000 \
  -e ANTHROPIC_API_KEY=your_key_here \
  -v $(pwd)/sessions:/app/sessions \
  -v $(pwd)/memory-bank:/app/memory-bank \
  -v $(pwd)/mood-data:/app/mood-data \
  mental-health-agent

# Or use docker-compose
docker-compose up -d

# View logs
docker logs -f mental-health-agent

# Stop
docker-compose down
```

## Cloud Platforms

### AWS Elastic Beanstalk

1. **Install EB CLI**
```bash
pip install awsebcli
```

2. **Initialize**
```bash
eb init -p node.js-18 mental-health-agent
```

3. **Create Environment**
```bash
eb create mental-health-agent-prod
```

4. **Set Environment Variables**
```bash
eb setenv ANTHROPIC_API_KEY=your_key_here
```

5. **Deploy**
```bash
eb deploy
```

### Google Cloud Platform (Cloud Run)

1. **Build Container**
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/mental-health-agent
```

2. **Deploy**
```bash
gcloud run deploy mental-health-agent \
  --image gcr.io/PROJECT_ID/mental-health-agent \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars ANTHROPIC_API_KEY=your_key_here
```

### Azure App Service

1. **Create Resource Group**
```bash
az group create --name mental-health-rg --location eastus
```

2. **Create App Service Plan**
```bash
az appservice plan create \
  --name mental-health-plan \
  --resource-group mental-health-rg \
  --sku B1 \
  --is-linux
```

3. **Create Web App**
```bash
az webapp create \
  --resource-group mental-health-rg \
  --plan mental-health-plan \
  --name mental-health-agent \
  --runtime "NODE|18-lts"
```

4. **Configure Environment**
```bash
az webapp config appsettings set \
  --resource-group mental-health-rg \
  --name mental-health-agent \
  --settings ANTHROPIC_API_KEY=your_key_here
```

5. **Deploy**
```bash
az webapp deployment source config-zip \
  --resource-group mental-health-rg \
  --name mental-health-agent \
  --src deploy.zip
```

### Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Set Environment Variables**
```bash
vercel env add ANTHROPIC_API_KEY
```

4. **Production Deployment**
```bash
vercel --prod
```

### Heroku

1. **Create App**
```bash
heroku create mental-health-agent
```

2. **Set Environment Variables**
```bash
heroku config:set ANTHROPIC_API_KEY=your_key_here
```

3. **Deploy**
```bash
git push heroku main
```

4. **Scale**
```bash
heroku ps:scale web=1
```

## Environment Variables

### Required
- `ANTHROPIC_API_KEY` - Your Anthropic API key

### Optional
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

### Example .env
```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
PORT=3000
NODE_ENV=production
```

## Security Considerations

### Production Checklist

#### 1. API Key Security
- [ ] Never commit API keys to version control
- [ ] Use environment variables
- [ ] Rotate keys regularly
- [ ] Use separate keys for dev/prod

#### 2. HTTPS/TLS
- [ ] Enable HTTPS in production
- [ ] Use Let's Encrypt for free certificates
- [ ] Redirect HTTP to HTTPS
- [ ] Enable HSTS headers

#### 3. Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use('/api/', limiter);
```

#### 4. Input Validation
- [ ] Validate all user inputs
- [ ] Sanitize messages before processing
- [ ] Implement content filtering
- [ ] Prevent injection attacks

#### 5. CORS Configuration
```typescript
import cors from 'cors';

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
```

#### 6. Authentication (Production)
```typescript
import session from 'express-session';

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // HTTPS only
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
```

#### 7. Data Encryption
- [ ] Encrypt sensitive data at rest
- [ ] Use HTTPS for data in transit
- [ ] Implement proper key management
- [ ] Follow HIPAA guidelines for healthcare data

#### 8. Logging & Monitoring
- [ ] Log security events
- [ ] Monitor for suspicious activity
- [ ] Set up alerts for errors
- [ ] Regular security audits

## Monitoring & Maintenance

### Health Checks
```bash
# Check if server is running
curl http://localhost:3000/health

# Expected response
{"status":"healthy","timestamp":"2025-11-16T..."}
```

### Logging
```typescript
// Add structured logging
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Metrics
```typescript
// Add Prometheus metrics
import promClient from 'prom-client';

const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

### Backup Strategy
```bash
# Backup sessions, memory, and mood data
tar -czf backup-$(date +%Y%m%d).tar.gz sessions/ memory-bank/ mood-data/

# Automated daily backups
0 2 * * * /path/to/backup-script.sh
```

### Update Strategy
```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Run tests
npm run evaluate

# Build
npm run build

# Restart with zero downtime
pm2 reload mental-health-agent
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### API Key Not Found
```bash
# Check environment variables
echo $ANTHROPIC_API_KEY

# Reload environment
source .env
```

#### Memory Issues
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

#### WebSocket Connection Failed
- Check firewall rules
- Verify proxy configuration
- Ensure WebSocket support in load balancer

## Performance Optimization

### Caching
```typescript
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

// Cache resource lookups
app.get('/api/resources', (req, res) => {
  const cached = cache.get('resources');
  if (cached) return res.json(cached);
  
  const resources = getResources();
  cache.set('resources', resources);
  res.json(resources);
});
```

### Load Balancing
```nginx
upstream mental_health_backend {
    least_conn;
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}

server {
    location / {
        proxy_pass http://mental_health_backend;
    }
}
```

### Database (Future)
For production scale, consider:
- PostgreSQL for sessions and user data
- Redis for caching and real-time features
- MongoDB for unstructured conversation logs

## Compliance

### HIPAA Compliance (Healthcare)
- [ ] Business Associate Agreement with hosting provider
- [ ] Encrypted data at rest and in transit
- [ ] Access controls and audit logs
- [ ] Regular security assessments
- [ ] Incident response plan
- [ ] Data retention and disposal policies

### GDPR Compliance (EU)
- [ ] User consent management
- [ ] Right to access data
- [ ] Right to deletion
- [ ] Data portability
- [ ] Privacy policy
- [ ] Data processing agreements

## Support

For deployment issues:
1. Check logs: `pm2 logs` or `docker logs`
2. Verify environment variables
3. Test health endpoint
4. Review security settings
5. Check firewall rules

---

**Remember**: This system handles sensitive mental health data. Always prioritize security, privacy, and compliance in production deployments.
