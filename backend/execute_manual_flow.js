const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const BASE_URL = 'http://localhost:8080';
const TEST_EMAIL = `manual_${Date.now()}@example.com`;
const TEST_PASSWORD = 'password123';
const COMPANY_NAME = `TestCorp_${Date.now()}`;

const delay = ms => new Promise(res => setTimeout(res, ms));

async function run() {
  try {
    console.log("== STEP 2: SIGNUP ==");
    const signupRes = await axios.post(`${BASE_URL}/auth/signup`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      company_name: COMPANY_NAME
    });
    console.log("Signup Response:", signupRes.data);
    
    console.log("Checking Prisma User Table...");
    const userCount = await prisma.user.count({ where: { email: TEST_EMAIL } });
    console.log(`User created. Count: ${userCount} \u2714`);

    console.log("\n== STEP 3: LOGIN ==");
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    const token = loginRes.data.token;
    console.log("Token received \u2714");

    console.log("\n== STEP 4: ONBOARDING / BUSINESS PROFILE ==");
    // Wait, the signup response already returned businessProfile!
    const slug = signupRes.data.user.businessProfile.slug;
    const public_token = signupRes.data.user.businessProfile.public_token;
    const bpCount = await prisma.businessProfile.count({ where: { slug } });
    console.log(`Business profile created. Count: ${bpCount} \u2714`);
    console.log("Slug:", slug, "Public Token:", public_token);

    console.log("\n== STEP 5: PUBLIC CHAT INIT ==");
    const initRes = await axios.post(`${BASE_URL}/conversation/init/${slug}`);
    const conversation_id = initRes.data.conversation_id;
    console.log("Conversation initialized. ID:", conversation_id, "\u2714");

    console.log("\n== STEP 6: SEND AI MESSAGES ==");
    const testMessages = [
      "I need help growing my business",
      "I have budget",
      "I want to start ASAP",
      "How much does it cost?"
    ];

    for(let msg of testMessages) {
      console.log(`Sending: "${msg}"`);
      const msgRes = await axios.post(`${BASE_URL}/conversation/ai_message`, {
        conversation_id,
        public_token,
        message: msg
      });
      console.log("AI Reply:", msgRes.data.reply.substring(0, 50) + "...");
      await delay(2000); // give time for background score/lead jobs
    }

    console.log("\n== VERIFYING DB END STATE ==");
    const conv = await prisma.conversation.findUnique({ where: { id: conversation_id } });
    console.log("Conversation scores updated \u2714", {
        urgency: conv.urgency_score,
        budget: conv.budget_score,
        authority: conv.authority_score
    });

    const msgCount = await prisma.message.count({ where: { conversation_id } });
    console.log(`Message table: ${msgCount} rows \u2714`);

    const lead = await prisma.lead.findUnique({ where: { conversation_id } });
    if(lead) {
       console.log("Lead created \u2714", "Status:", lead.lead_status);
    } else {
       console.log("Lead NOT created.");
    }

  } catch(e) {
    console.error("FAILED", e.response ? e.response.data : e.stack);
  } finally {
    await prisma.$disconnect();
  }
}

run();
