const fs = require('fs');
require('dotenv').config();

// Mock Prisma client for unit testing services without active DB connections
jestMockPrisma();

const { ScraperService } = require('./dist/modules/setup/scraper.service');
const { EscalationService } = require('./dist/modules/conversation/escalation.service');
const { CalendarSyncService } = require('./dist/modules/external/calendar-sync.service');

function jestMockPrisma() {
  // Inject mock implementation in global prisma config before services load
  const prismaMock = {
    scrapeJob: {
      create: async ({ data }) => ({ id: 999, ...data }),
      update: async ({ where, data }) => ({ id: where.id, ...data })
    },
    calendarEvent: {
      upsert: async ({ create }) => ({ id: 888, ...create })
    },
    lead: {
      findFirst: async () => ({
        id: 777,
        name: "Test Lead",
        email: "testprospect@gmail.com",
        lead_status: "ANONYMOUS"
      }),
      update: async ({ where, data }) => ({ id: where.id, ...data })
    },
    conversation: {
      findUnique: async () => ({
        id: 111,
        status: "ACTIVE",
        BusinessProfile: {
          id: 222,
          company_name: "Pre-Closure AI Test",
          User: { email: "owner@preclosure.ai" }
        },
        Messages: [
          { sender: "AI", content: "Hello! How can I help you scale today?" },
          { sender: "USER", content: "I'm looking for a sales qualification tool." },
          { sender: "AI", content: "Great! Pre-Closure AI qualifies your B2B leads." }
        ]
      }),
      update: async ({ where, data }) => ({ id: where.id, ...data })
    },
    followUp: {
      create: async ({ data }) => ({ id: 555, ...data })
    }
  };

  const prismaPath = './dist/config/prisma';
  try {
    // If built files exist, override the export
    const prismaModule = require(prismaPath);
    prismaModule.prisma = prismaMock;
  } catch (e) {
    // Compiled files not generated yet, we'll patch config/prisma if needed
  }
}

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function runScraperTest() {
  console.log("\n🚀 [Scraper Test] Crawling and Extracting from Pre-Closure AI website...");
  try {
    // Crawl a live website (Pre-Closure AI project uses its own domain or fallback)
    const result = await ScraperService.crawlAndExtract(222, "https://krishnabarua.com");
    console.log("Scraper result status:", result.status);
    console.log("Confidence Score:", result.confidence_score);
    console.log("Extracted Profile:", JSON.stringify(result.profile, null, 2));

    // Assertions
    const passed = result.profile && result.profile.business_name && result.profile.services.length > 0;
    if (passed) {
      console.log("✨ Scraper Test Passed!");
    } else {
      console.warn("⚠️ Scraper returned fallback profile or empty data.");
    }
  } catch (err) {
    console.error("❌ Scraper Test Failed:", err.message);
  }
}

async function runEscalationTest() {
  console.log("\n🚀 [Escalation Test] Querying Escalation Engine with frustrated inputs...");
  const frustratedMessages = [
    "I want to speak to a human sales rep right now.",
    "Stop sending automated replies, this is useless.",
    "Is this a bot? Connect me with sales."
  ];

  for (const msg of frustratedMessages) {
    console.log(`\nUser: "${msg}"`);
    try {
      const result = await EscalationService.checkAndEscalate(111, msg);
      console.log("Escalation Result:", JSON.stringify(result, null, 2));
      
      if (result.escalated && result.reply.includes("notify the team")) {
        console.log(`✨ Escalation Test Passed for message: "${msg}"`);
      } else {
        console.warn(`⚠️ Escalation failed to trigger for message: "${msg}"`);
      }
    } catch (err) {
      console.error("❌ Escalation Test Failed:", err.message);
    }
    await sleep(3000); // cooldown between model calls
  }
}

async function runCalendarSyncTest() {
  console.log("\n🚀 [Calendar Sync Test] Processing Cal.com Webhook cancellation payload...");
  const mockCalComPayload = {
    event: "booking.cancelled",
    provider: "cal_com",
    eventId: "cal_123456",
    email: "testprospect@gmail.com",
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    meetingUrl: "https://meet.google.com/abc-defg-hij"
  };

  try {
    const result = await CalendarSyncService.processWebhookEvent(mockCalComPayload);
    console.log("Webhook sync result:", JSON.stringify(result, null, 2));

    if (result.status === 'SUCCESS' && result.eventStatus === 'CANCELLED') {
      console.log("✨ Calendar Webhook Sync Test Passed!");
    } else {
      console.warn("⚠️ Calendar Webhook Sync returned unexpected result.");
    }
  } catch (err) {
    console.error("❌ Calendar Webhook Sync Test Failed:", err.message);
  }
}

async function start() {
  console.log("🏁 Starting Enterprise Core Features Test Validation...");
  await runScraperTest();
  await sleep(3000);
  await runEscalationTest();
  await sleep(3000);
  await runCalendarSyncTest();
  console.log("\n🏁 All tests finished!");
}

start();
