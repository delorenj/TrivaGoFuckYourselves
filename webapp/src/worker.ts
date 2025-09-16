/**
 * Cloudflare Worker for Trello Webhook Processing
 * Handles incoming webhooks from Trello and processes them accordingly
 */

/// <reference types="@cloudflare/workers-types" />

export interface Env {
  WEBHOOK_DATA: KVNamespace;
  TRELLO_API_KEY?: string;
  TRELLO_TOKEN?: string;
  WEBHOOK_SECRET?: string;
  ENVIRONMENT: string;
}

interface TrelloWebhook {
  action: {
    type: string;
    data: Record<string, any>;
    memberCreator: {
      id: string;
      username: string;
      fullName: string;
    };
    date: string;
  };
  model: {
    id: string;
    name: string;
    desc: string;
  };
}

// Verify webhook signature for security
function verifyWebhookSignature(request: Request, secret: string): boolean {
  const signature = request.headers.get('x-trello-webhook');
  if (!signature || !secret) return false;

  // Implement Trello webhook signature verification
  // This is a placeholder - implement actual verification based on Trello's documentation
  return true;
}

// Process different webhook action types
async function processWebhookAction(webhook: TrelloWebhook, env: Env): Promise<Response> {
  const { action } = webhook;

  // Store webhook data in KV for processing
  const key = `webhook_${Date.now()}_${action.type}`;
  await env.WEBHOOK_DATA.put(key, JSON.stringify(webhook), {
    expirationTtl: 86400 // Expire after 24 hours
  });

  // Process based on action type
  switch (action.type) {
    case 'createCard':
      return handleCardCreation(webhook, env);
    case 'updateCard':
      return handleCardUpdate(webhook, env);
    case 'commentCard':
      return handleCardComment(webhook, env);
    case 'addMemberToCard':
      return handleMemberAdded(webhook, env);
    default:
      console.log(`Unhandled webhook action type: ${action.type}`);
      return new Response(JSON.stringify({
        status: 'received',
        action: action.type,
        processed: false
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
  }
}

async function handleCardCreation(webhook: TrelloWebhook, _env: Env): Promise<Response> {
  const { action } = webhook;

  // Log card creation
  console.log(`Card created: ${action.data.card?.name} by ${action.memberCreator.fullName}`);

  // Implement your card creation logic here
  // For example: notify team, create tasks in other systems, etc.

  return new Response(JSON.stringify({
    status: 'processed',
    action: 'createCard',
    cardId: action.data.card?.id
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleCardUpdate(webhook: TrelloWebhook, _env: Env): Promise<Response> {
  const { action } = webhook;

  console.log(`Card updated: ${action.data.card?.name}`);

  // Implement card update logic

  return new Response(JSON.stringify({
    status: 'processed',
    action: 'updateCard',
    cardId: action.data.card?.id
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleCardComment(webhook: TrelloWebhook, _env: Env): Promise<Response> {
  const { action } = webhook;

  console.log(`Comment added to card by ${action.memberCreator.fullName}`);

  // Implement comment handling logic

  return new Response(JSON.stringify({
    status: 'processed',
    action: 'commentCard'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleMemberAdded(webhook: TrelloWebhook, _env: Env): Promise<Response> {
  const { action } = webhook;

  console.log(`Member added to card: ${action.data.member?.fullName}`);

  // Implement member assignment logic

  return new Response(JSON.stringify({
    status: 'processed',
    action: 'addMemberToCard'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// HEAD request handler for Trello webhook verification
async function handleHeadRequest(): Promise<Response> {
  return new Response(null, { status: 200 });
}

// GET request handler for status and testing
async function handleGetRequest(env: Env): Promise<Response> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Trello Webhook Processor</title>
        <style>
          body {
            font-family: system-ui;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
          }
          .status {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            background: #10b981;
            color: white;
          }
        </style>
      </head>
      <body>
        <div class="status">
          <h1>🎯 Trello Webhook Processor</h1>
          <p>Status: <span class="badge">ACTIVE</span></p>
          <p>Environment: ${env.ENVIRONMENT}</p>
          <p>Ready to receive Trello webhooks at this endpoint.</p>
          <hr>
          <h3>Supported Actions:</h3>
          <ul>
            <li>Card Creation</li>
            <li>Card Updates</li>
            <li>Comments</li>
            <li>Member Assignments</li>
          </ul>
        </div>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {

    // Handle different HTTP methods
    switch (request.method) {
      case 'HEAD':
        // Trello sends HEAD request to verify webhook endpoint
        return handleHeadRequest();

      case 'GET':
        // Status page for monitoring
        return handleGetRequest(env);

      case 'POST':
        // Main webhook handler
        try {
          // Verify webhook signature if secret is configured
          if (env.WEBHOOK_SECRET && !verifyWebhookSignature(request, env.WEBHOOK_SECRET)) {
            return new Response('Unauthorized', { status: 401 });
          }

          // Parse webhook payload
          const webhook = await request.json() as TrelloWebhook;

          // Process webhook asynchronously
          ctx.waitUntil(processWebhookAction(webhook, env));

          // Return immediate response to Trello
          return new Response(JSON.stringify({ status: 'received' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('Webhook processing error:', error);
          return new Response('Internal Server Error', { status: 500 });
        }

      default:
        return new Response('Method Not Allowed', { status: 405 });
    }
  }
};