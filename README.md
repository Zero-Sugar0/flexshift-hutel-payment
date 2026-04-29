# Hubtel Payment & Disbursement Integration Service

A production-ready Node.js backend service for Hubtel Checkout and Disbursement APIs, featuring reliable callbacks via QStash.

## Features

- **Unified Checkout**: Initiate payments and check transaction status.
- **Disbursements**: Support for single and batch payouts.
- **Reliable Callbacks**: Integration with Upstash QStash to guarantee delivery and retries for webhooks.
- **Production Grade**: Request validation with Zod, structured logging with Winston, and global error handling.
- **Dockerized**: Easy deployment with Docker and Docker Compose.

## Environment Variables

Copy `.env.example` to `.env` and fill in the following:

- `HUBTEL_CLIENT_ID`: Your Hubtel Client ID.
- `HUBTEL_CLIENT_SECRET`: Your Hubtel Client Secret.
- `HUBTEL_MERCHANT_ACCOUNT_NUMBER`: Your Hubtel Merchant Account Number (e.g. HMXXXXXX).
- `QSTASH_TOKEN`: Upstash QStash Token.
- `QSTASH_CURRENT_SIGNING_KEY`: QStash Current Signing Key.
- `QSTASH_NEXT_SIGNING_KEY`: QStash Next Signing Key.
- `APP_BASE_URL`: The public URL of this service (for callbacks).
- `PORT`: Server port (default 3000).
- `NODE_ENV`: development, production, or test.

## API Endpoints

### Checkout

- `POST /api/v1/checkout/initiate`: Initiate a new checkout payment.
- `GET /api/v1/checkout/status/:transactionId`: Check status of a checkout transaction.

### Disbursement

- `POST /api/v1/disbursement/single`: Initiate a single payout.
- `POST /api/v1/disbursement/batch`: Initiate a batch payout (JSON array).
- `GET /api/v1/disbursement/status/:transactionId`: Check status of a disbursement.

### Callbacks

- `POST /api/v1/callback`: Hubtel's callback entry point (proxies to QStash).
- `POST /api/v1/callback/process`: QStash's retryable endpoint for business logic.

## Running the App

### Local Development

```bash
npm install
npm run dev
```

### Using Docker

```bash
docker-compose up --build
```

## Response Format

All endpoints return a normalized JSON response:

```json
{
  "transactionId": "string",
  "status": "success | pending | failed | error",
  "message": "string",
  "metadata": {}
}
```
