"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperService = void 0;
const axios_1 = __importDefault(require("axios"));
const openai_1 = require("openai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'sk-dummy-key'
});
class ScraperService {
    /**
     * Main entry: Discover leads via Google Maps + SERP scraping.
     * Uses SerpAPI (free tier / pay-as-you-go) for Google Maps results.
     * Falls back to mock data if no API key.
     */
    static async discoverLeads(niche, location, count = 10) {
        const serpApiKey = process.env.SERPAPI_KEY;
        if (!serpApiKey) {
            console.warn('[ScraperService] No SERPAPI_KEY. Using intelligent mock data.');
            return this.generateMockLeads(niche, location, count);
        }
        try {
            const leads = [];
            // 1. Google Maps scraping via SerpAPI
            const mapsResults = await this.scrapeGoogleMaps(serpApiKey, niche, location, count);
            leads.push(...mapsResults);
            // 2. SERP scraping for additional businesses
            if (leads.length < count) {
                const serpResults = await this.scrapeSERP(serpApiKey, niche, location, count - leads.length);
                leads.push(...serpResults);
            }
            // 3. Deduplicate
            const deduped = this.deduplicateLeads(leads);
            // 4. Filter: must have website + active business
            const filtered = deduped.filter(l => l.website && l.website.length > 5 && l.name);
            return filtered.slice(0, count);
        }
        catch (error) {
            console.error('[ScraperService] Scraping failed, using mock data:', error);
            return this.generateMockLeads(niche, location, count);
        }
    }
    /**
     * Google Maps scraping via SerpAPI
     */
    static async scrapeGoogleMaps(apiKey, niche, location, count) {
        try {
            const response = await axios_1.default.get('https://serpapi.com/search.json', {
                params: {
                    engine: 'google_maps',
                    q: `${niche} in ${location}`,
                    type: 'search',
                    api_key: apiKey,
                    num: Math.min(count, 20),
                },
                timeout: 15000,
            });
            const places = response.data.local_results || [];
            return places.map((place) => ({
                name: place.title || place.name || 'Unknown Business',
                website: place.website || '',
                phone: place.phone || '',
                rating: place.rating || 0,
                reviews: place.reviews || 0,
                address: place.address || location,
                industry: niche,
                location: location,
                description: place.description || place.snippet || `A ${niche} business in ${location}`,
                source: 'GOOGLE_MAPS',
            }));
        }
        catch (error) {
            console.error('[ScraperService] Google Maps scraping failed:', error);
            return [];
        }
    }
    /**
     * Regular Google SERP scraping for business websites
     */
    static async scrapeSERP(apiKey, niche, location, count) {
        try {
            const response = await axios_1.default.get('https://serpapi.com/search.json', {
                params: {
                    engine: 'google',
                    q: `best ${niche} companies in ${location}`,
                    api_key: apiKey,
                    num: Math.min(count, 10),
                },
                timeout: 15000,
            });
            const organic = response.data.organic_results || [];
            return organic
                .filter((r) => r.link && !r.link.includes('wikipedia') && !r.link.includes('yelp'))
                .map((r) => ({
                name: r.title || 'Unknown',
                website: r.link || '',
                phone: '',
                rating: 0,
                reviews: 0,
                address: location,
                industry: niche,
                location: location,
                description: r.snippet || `Found via Google search for ${niche} in ${location}`,
                source: 'SERP',
            }));
        }
        catch (error) {
            console.error('[ScraperService] SERP scraping failed:', error);
            return [];
        }
    }
    /**
     * Deduplicate leads by name similarity and website domain
     */
    static deduplicateLeads(leads) {
        const seen = new Map();
        return leads.filter(lead => {
            const key1 = lead.name.toLowerCase().trim();
            const key2 = lead.website ? new URL(lead.website).hostname.replace('www.', '') : '';
            const compositeKey = key2 || key1;
            if (seen.has(compositeKey))
                return false;
            seen.set(compositeKey, true);
            return true;
        });
    }
    /**
     * AI-powered lead enrichment: extract services, target audience, pain points from website
     */
    static async enrichLead(lead) {
        let websiteContent = '';
        // Attempt to fetch website content
        if (lead.website) {
            try {
                const resp = await axios_1.default.get(lead.website, {
                    timeout: 8000,
                    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PreCloserBot/1.0)' },
                    maxRedirects: 3,
                });
                // Extract text from HTML (strip tags)
                websiteContent = resp.data
                    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                    .replace(/<[^>]+>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim()
                    .substring(0, 2000);
            }
            catch {
                websiteContent = 'Website unreachable';
            }
        }
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{
                        role: 'system',
                        content: `You are a business intelligence analyst. Analyze this business and extract structured data.

BUSINESS: ${lead.name}
INDUSTRY: ${lead.industry}
LOCATION: ${lead.location}
WEBSITE CONTENT: ${websiteContent}
RATING: ${lead.rating} (${lead.reviews} reviews)

Return ONLY valid JSON:
{
  "services": ["service1", "service2"],
  "targetAudience": "who they serve",
  "painPoints": ["pain1", "pain2", "pain3"],
  "businessType": "B2B/B2C/Both",
  "websiteQuality": 7,
  "growthSignals": ["signal1", "signal2"]
}

RULES:
- websiteQuality: 1-10 based on content quality, modern design indicators
- growthSignals: hiring, expanding, new services, active social media, recent blog posts
- painPoints: what problems they likely face based on their industry`
                    }],
                response_format: { type: 'json_object' },
                temperature: 0.3,
            });
            const parsed = JSON.parse(response.choices[0].message.content || '{}');
            return {
                ...lead,
                services: parsed.services || [],
                targetAudience: parsed.targetAudience || 'Unknown',
                painPoints: parsed.painPoints || [],
                businessType: parsed.businessType || 'Unknown',
                websiteQuality: parsed.websiteQuality || 5,
                growthSignals: parsed.growthSignals || [],
            };
        }
        catch (error) {
            console.error('[ScraperService] Enrichment failed for', lead.name, error);
            return {
                ...lead,
                services: [],
                targetAudience: 'Unknown',
                painPoints: ['efficiency', 'client acquisition', 'scaling'],
                businessType: 'Unknown',
                websiteQuality: 5,
                growthSignals: [],
            };
        }
    }
    /**
     * 5-Dimension Lead Scoring (out of 100)
     */
    static scoreLead(enriched, targetNiche) {
        let score = 0;
        const breakdown = {};
        // 1. Niche Match (30 points)
        const nicheMatch = enriched.industry.toLowerCase().includes(targetNiche.toLowerCase()) ||
            enriched.services.some(s => s.toLowerCase().includes(targetNiche.toLowerCase()));
        breakdown.nicheMatch = nicheMatch ? 30 : (enriched.painPoints.length > 0 ? 15 : 5);
        score += breakdown.nicheMatch;
        // 2. Activity (20 points) — based on reviews, rating
        if (enriched.reviews > 50)
            breakdown.activity = 20;
        else if (enriched.reviews > 20)
            breakdown.activity = 15;
        else if (enriched.reviews > 5)
            breakdown.activity = 10;
        else
            breakdown.activity = 5;
        score += breakdown.activity;
        // 3. Website Quality (10 points)
        breakdown.websiteQuality = enriched.websiteQuality;
        score += Math.min(breakdown.websiteQuality, 10);
        // 4. Growth Signals (20 points)
        const growthScore = Math.min(enriched.growthSignals.length * 5, 20);
        breakdown.growthSignals = growthScore;
        score += growthScore;
        // 5. Service Fit (20 points)
        const serviceFit = enriched.painPoints.length >= 3 ? 20 :
            enriched.painPoints.length >= 2 ? 15 :
                enriched.painPoints.length >= 1 ? 10 : 5;
        breakdown.serviceFit = serviceFit;
        score += serviceFit;
        // Tag
        const tag = score >= 70 ? 'HOT' : score >= 45 ? 'WARM' : 'COLD';
        return { score, tag, breakdown };
    }
    /**
     * Generate realistic mock leads for development/demo
     */
    static generateMockLeads(niche, location, count) {
        const templates = [
            { prefix: 'Apex', suffix: 'Solutions', rating: 4.8, reviews: 127 },
            { prefix: 'Premier', suffix: 'Group', rating: 4.5, reviews: 89 },
            { prefix: 'Elite', suffix: 'Partners', rating: 4.7, reviews: 203 },
            { prefix: 'NextGen', suffix: 'Corp', rating: 4.3, reviews: 45 },
            { prefix: 'Pinnacle', suffix: 'Services', rating: 4.6, reviews: 156 },
            { prefix: 'Vanguard', suffix: 'Tech', rating: 4.9, reviews: 312 },
            { prefix: 'Catalyst', suffix: 'Labs', rating: 4.4, reviews: 67 },
            { prefix: 'Momentum', suffix: 'Digital', rating: 4.2, reviews: 34 },
            { prefix: 'Horizon', suffix: 'Consulting', rating: 4.8, reviews: 178 },
            { prefix: 'Summit', suffix: 'Enterprises', rating: 4.1, reviews: 23 },
            { prefix: 'Frontier', suffix: 'Agency', rating: 4.7, reviews: 98 },
            { prefix: 'Zenith', suffix: 'Studios', rating: 4.6, reviews: 145 },
            { prefix: 'Nova', suffix: 'Innovations', rating: 4.5, reviews: 76 },
            { prefix: 'Atlas', suffix: 'Dynamics', rating: 4.3, reviews: 52 },
            { prefix: 'Quantum', suffix: 'Ventures', rating: 4.8, reviews: 189 },
        ];
        const leads = [];
        for (let i = 0; i < Math.min(count, templates.length); i++) {
            const t = templates[i];
            const domain = `${t.prefix.toLowerCase()}${t.suffix.toLowerCase()}.com`;
            leads.push({
                name: `${t.prefix} ${niche} ${t.suffix}`,
                website: `https://www.${domain}`,
                phone: `+91-${9000000000 + Math.floor(Math.random() * 999999999)}`,
                rating: t.rating,
                reviews: t.reviews,
                address: `${location}, India`,
                industry: niche,
                location: location,
                description: `Leading ${niche.toLowerCase()} company serving businesses in ${location} with innovative solutions.`,
                source: 'GOOGLE_MAPS',
            });
        }
        return leads;
    }
}
exports.ScraperService = ScraperService;
