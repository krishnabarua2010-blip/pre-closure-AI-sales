import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the path to our local mock database file
const DB_PATH = path.join(process.cwd(), 'mock_db.json');

// Helper to read the mock DB
const readDB = () => {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading mock DB', e);
  }
  return { leads: [], conversations: {}, business_profiles: {} };
};

// Helper to write to the mock DB
const writeDB = (data: any) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing mock DB', e);
  }
};

const handleRequest = async (request: Request, props: { params: Promise<{ path: string[] }> }) => {
  const params = await props.params;
  const routePath = params.path.join('/');
  console.log(`[MOCK API] Dispatched to /${routePath}`);

  const db = readDB();

  try {
    // Determine HTTP method
    const method = request.method;

    if (method === 'POST') {
      let body: any = {};
      try {
        body = await request.json();
      } catch (e) {}

      switch (routePath) {
        case 'generate_onboarding':
          const slug = body.business_name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'test-business';
          db.business_profiles[slug] = {
            name: body.business_name || 'Test Business',
            industry: body.services_purchased || 'Software'
          };
          writeDB(db);
          return NextResponse.json({
            summary: `**Executive Summary for ${body.client_name}**\n\nYour onboarding details have been successfully processed.\n\nAssigned AI Assistant Link generated: localhost:3000/c/${slug}`,
            slug: slug
          });

        case 'init_public_conversation': {
          const { slug: reqSlug } = body;
          const convId = `conv_${Date.now()}`;
          db.conversations[convId] = {
            slug: reqSlug,
            messages: []
          };
          writeDB(db);
          return NextResponse.json({
            conversation_id: convId,
            public_token: `pub_token_${Date.now()}`,
            assistant_name: 'Pre-Closer AI'
          });
        }

        case 'ai_message': {
          const { conversation_id, message } = body;
          if (!db.conversations[conversation_id]) {
             db.conversations[conversation_id] = { messages: [] };
          }
          
          db.conversations[conversation_id].messages.push({ role: 'user', content: message });
          
          const msgCount = db.conversations[conversation_id].messages.filter((m:any) => m.role === 'user').length;
          
          let aiResponse = "I hear you. Tell me more about your business.";
          
          if (msgCount === 1) aiResponse = "That's interesting. What are your specific revenue goals?";
          if (msgCount === 2) aiResponse = "Got it. And what budget have you allocated for this solution?";
          if (msgCount === 3) aiResponse = "Understood. Are you the primary decision-maker for this project?";
          if (msgCount >= 4) {
             aiResponse = "Perfect. Based on this, I strongly recommend we schedule a brief 15-minute call. Does tomorrow work for you?";
             // Create a lead if one doesn't exist
             if (!db.leads.find((l:any) => l.email === `lead_${conversation_id}@example.com`)) {
               db.leads.unshift({
                 id: `lead_${Date.now()}`,
                 name: 'Potential Buyer',
                 email: `lead_${conversation_id}@example.com`,
                 score: 85 + Math.floor(Math.random() * 10),
                 status: 'qualified',
                 last_interaction: new Date().toISOString()
               });
             }
          }
          
          db.conversations[conversation_id].messages.push({ role: 'assistant', content: aiResponse });
          writeDB(db);

          return NextResponse.json({
            response: aiResponse,
            conversation_id
          });
        }

        case 'advisor_analysis':
          return NextResponse.json({
            funnel_summary: { v2l_conversion: 0.35, l2s_conversion: 0.42 },
            bottlenecks: [
              { stage: "lead_qualification", severity: "high", description: "Buying intent spikes not immediately followed up. Reduce response time to under 15 mins." }
            ],
            actions: [
              "Automate follow-up sequences for users hitting score > 80.",
              "Prepare specialized enterprise case studies for current pipeline."
            ],
            projected_revenue: 125000 + (db.leads.length * 2000)
          });

        default:
          return NextResponse.json({ message: 'Mocked POST' });
      }
    } else if (method === 'GET') {
      const { searchParams } = new URL(request.url);
      
      switch (routePath) {
        case 'get_leads':
          return NextResponse.json({ leads: db.leads });
          
        case 'funnel_health':
          return NextResponse.json({
            health_score: 85,
            total_leads: 120 + db.leads.length,
            win_rate: 0.42,
            rps: 2000
          });
          
        case 'revenue_metrics':
          return NextResponse.json({
            mrr: 45000 + (db.leads.length * 500),
            arr: 540000 + (db.leads.length * 6000),
            growth_rate: 0.23,
            churn_rate: 0.08
          });

        case 'conversation_messages': {
           const convId = searchParams.get('conversation_id');
           const conv = db.conversations[convId as string];
           return NextResponse.json({ messages: conv ? conv.messages : [] });
        }

        default:
          return NextResponse.json({ message: 'Mocked GET data' });
      }
    }
    
    return NextResponse.json({ message: 'Method not mocked' }, { status: 405 });

  } catch (err: any) {
    console.error('[MOCK API ERROR]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

export { handleRequest as GET, handleRequest as POST, handleRequest as PUT, handleRequest as DELETE };
