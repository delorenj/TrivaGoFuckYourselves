# TrivaGoFuckYourselves

Automated Trello webhook processing system built with Cloudflare Workers, React, and TypeScript.

## 🚀 Features

- **Webhook Processing**: Handles Trello webhooks for card operations
- **Cloudflare Workers**: Serverless edge computing for webhook handling
- **React Frontend**: Dashboard for monitoring webhook activity
- **TypeScript**: Full type safety across the stack
- **SPARC Development**: Systematic TDD with AI assistance

## 📋 Prerequisites

- Node.js 18+
- pnpm package manager
- Cloudflare account (for Workers)
- Trello API credentials

## 🛠️ Setup

### 1. Install Dependencies

```bash
# Install root dependencies
pnpm install

# Install webapp dependencies
cd webapp && pnpm install
```

### 2. Configure Environment

Copy the example environment file and add your credentials:

```bash
cp webapp/.env.example webapp/.env
```

Edit `webapp/.env`:
```env
TRELLO_API_KEY=your_api_key_here
TRELLO_TOKEN=your_token_here
WEBHOOK_SECRET=your_webhook_secret_here
```

### 3. Configure Cloudflare

Update `wrangler.toml` with your Cloudflare account details:
- Set your `account_id`
- Configure KV namespace IDs
- Set production route patterns

## 🔧 Development

### Local Development

```bash
# Run the development server
npm run dev

# Run with SPARC coordination
npm run sparc run dev "implement feature"
```

### Build for Production

```bash
npm run build

# Deploy to Cloudflare Workers
npm run deploy
```

## 🎯 Webhook Endpoints

The worker handles the following Trello webhook events:

- **Card Creation**: `/webhook` (POST)
- **Card Updates**: `/webhook` (POST)
- **Comments**: `/webhook` (POST)
- **Member Assignments**: `/webhook` (POST)

### Testing Webhooks

1. Visit your worker URL to see the status page
2. Use the Trello API to register your webhook endpoint
3. Monitor KV storage for processed webhooks

## 🐝 Claude Flow Integration

This project uses Claude Flow for enhanced AI-assisted development:

```bash
# Initialize swarm for complex tasks
npm run swarm

# Use hooks for automated workflows
npm run hooks

# Run SPARC methodology
npm run sparc tdd "implement new feature"
```

## 📁 Project Structure

```
TrivaGoFuckYourselves/
├── webapp/               # React frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities
│   │   └── worker.ts     # Cloudflare Worker
│   ├── dist/             # Build output
│   └── package.json
├── wrangler.toml         # Cloudflare configuration
├── package.json          # Root package configuration
└── README.md
```

## 🚀 Deployment

### Deploy to Cloudflare Workers

```bash
# Login to Cloudflare
npx wrangler login

# Deploy to production
npm run deploy
```

### Environment-Specific Deployment

```bash
# Deploy to staging
npx wrangler deploy --env staging

# Deploy to production
npx wrangler deploy --env production
```

## 📊 Monitoring

- View worker logs: `npx wrangler tail`
- Check KV storage: `npx wrangler kv:key list --binding WEBHOOK_DATA`
- Monitor via Cloudflare dashboard

## 🔒 Security

- Webhook signatures are verified for authenticity
- Environment variables stored securely
- KV data expires after 24 hours
- HTTPS-only communication

## 📝 License

MIT