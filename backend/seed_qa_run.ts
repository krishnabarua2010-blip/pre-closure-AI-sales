import { prisma } from './src/config/prisma';
import { DiscoveryService } from './src/modules/discovery/discovery.service';
import { AIService } from './src/modules/ai/ai.service';
import * as crypto from 'crypto';

async function main() {
  console.log("🚀 STARTING MASTER QA ACCCKOUT SETUP...");

  // 1. Create or Update Master User
  const user = await prisma.user.upsert({
    where: { email: 'test@yourcompany.com' },
    update: { plan: 'PRO' },
    create: {
      email: 'test@yourcompany.com',
      password_hash: crypto.randomBytes(16).toString('hex'), // dummy hash
      plan: 'PRO'
    }
  });
  console.log("✅ Master User Created/Updated:", user.email, "| Plan:", user.plan);

  // 2. Create or Update Business Profile
  const bp = await prisma.businessProfile.upsert({
    where: { slug: 'test-digital-agency' },
    update: {
      user_id: user.id,
      company_name: 'Test Digital Agency',
      industry: 'Lead Generation for SMEs',
      business_description: 'We generate highly qualified leads for SMEs using AI and automation.',
      ideal_customer: 'SME owners looking to grow',
      target_audience: 'India'
    },
    create: {
      user_id: user.id,
      company_name: 'Test Digital Agency',
      slug: 'test-digital-agency',
      public_token: crypto.randomBytes(8).toString('hex'),
      industry: 'Lead Generation for SMEs',
      business_description: 'We generate highly qualified leads for SMEs using AI and automation.',
      ideal_customer: 'SME owners looking to grow',
      target_audience: 'India'
    }
  });
  console.log("✅ Business Profile Created:", bp.company_name);

  // 3. QA TEST: Dicovery Service
  console.log("\n🔍 1. LEAD DISCOVERY TEST & INTELLIGENCE TEST");
  const startTime = Date.now();
  const leads = await DiscoveryService.discoverAndScorePipeline(bp.id, 'Lead Generation for SMEs', 'India', 3);
  const discoveryTime = Date.now() - startTime;
  console.log(`✅ Leads generated in ${discoveryTime}ms`);
  leads.forEach((l, idx) => {
    console.log(`   - Lead ${idx+1}: ${l.name} | Intent Score: ${l.intent_score} | Qual: ${l.qualification_level}`);
  });

  // 4. QA TEST: Chat Simulation
  console.log("\n🤖 2. AI CHAT & LEAD SCORING TEST");
  // Create dummy conversation
  const conv = await prisma.conversation.create({
    data: {
      user_id: user.id,
      business_profile_id: bp.id,
      status: 'ACTIVE'
    }
  });

  const chatMsg = "Hi, we are looking for more B2B leads. We have a budget of $5k/mo.";
  await prisma.message.create({
    data: {
      conversation_id: conv.id,
      sender: 'USER',
      content: chatMsg
    }
  });

  const aiStart = Date.now();
  const aiResponse = await AIService.generateResponse(conv.id, chatMsg);
  await prisma.message.create({
    data: {
      conversation_id: conv.id,
      sender: 'AI',
      content: aiResponse
    }
  });
  console.log(`✅ AI Replied in ${Date.now() - aiStart}ms: "${aiResponse}"`);

  // Analyze and score chat
  const scoreStart = Date.now();
  const scoring = await AIService.analyzeAndScore(conv.id, chatMsg);
  console.log(`✅ Chat scored in ${Date.now() - scoreStart}ms. Intent: ${scoring.intent_score}, Budget: ${scoring.budget_score}`);

  // Fetch updated lead info
  const qualifiedLead = await prisma.lead.findUnique({ where: { conversation_id: conv.id } });
  if (qualifiedLead) {
    console.log(`✅ Qualified Lead Promoted: Conversion Prob: ${qualifiedLead.conversion_probability}%`);
  }

  console.log("\n✅ ALL TESTS COMPLETE.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
