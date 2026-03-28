const crypto = require('crypto');
const axios = require('axios');
require('dotenv').config();

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret_development';
const API_URL = 'http://localhost:3000/payment/razorpay-webhook';

function createSignature(payload) {
  return crypto.createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex');
}

async function sendWebhook(event, payloadObj) {
  const payloadStr = JSON.stringify(payloadObj);
  const signature = createSignature(payloadStr);

  try {
    const res = await axios.post(API_URL, payloadStr, {
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': signature
      }
    });
    console.log(`✅ [${event}] SUCCESS =>`, res.data);
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
       console.error(`❌ [${event}] FAILED => Backend is not running at ${API_URL}`);
    } else {
       console.error(`❌ [${event}] FAILED =>`, err.response?.data || err.message);
    }
  }
}

const MOCK_SUB_ID = 'sub_' + Math.floor(Math.random() * 1000000);

const payloads = {
  activated: {
    event: 'subscription.activated',
    payload: { subscription: { entity: { id: MOCK_SUB_ID, status: 'active' } } }
  },
  charged: {
    event: 'subscription.charged',
    payload: { subscription: { entity: { id: MOCK_SUB_ID, status: 'active' } } }
  },
  failed: {
    event: 'payment.failed',
    payload: {
      payment: { entity: { error_description: 'Card declined due to insufficient funds' } },
      subscription: { entity: { id: MOCK_SUB_ID } }
    }
  },
  cancelled: {
    event: 'subscription.cancelled',
    payload: { subscription: { entity: { id: MOCK_SUB_ID, status: 'cancelled' } } }
  }
};

async function runTests() {
  console.log('--- STARTING LIFECYCLE WEBHOOK TESTS ---');
  console.log(`Using mock subscription_id: ${MOCK_SUB_ID}`);
  await sendWebhook('subscription.activated', payloads.activated);
  await sendWebhook('subscription.charged', payloads.charged);
  await sendWebhook('payment.failed', payloads.failed);
  await sendWebhook('subscription.cancelled', payloads.cancelled);
  console.log('--- TESTS COMPLETE ---');
}

runTests();
