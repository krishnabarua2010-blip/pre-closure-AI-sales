"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperService = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = require("../../config/prisma");
dotenv_1.default.config();
class ScraperService {
    static async fetchPageText(url) {
        try {
            const response = await fetch(url, {
                signal: AbortSignal.timeout(10000), // 10s timeout per page
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            if (!response.ok)
                return '';
            const html = await response.text();
            const $ = cheerio_1.default.load(html);
            // Remove style, scripts, headers, footers, navs to get clean content
            $('script, style, iframe, nav, footer, header').remove();
            const text = $('body').text().replace(/\s+/g, ' ').trim();
            return text.substring(0, 4000); // Grab first 4k chars
        }
        catch (e) {
            console.warn(`[Scraper Warning] Failed to fetch subpage ${url}:`, e.message);
            return '';
        }
    }
    static async crawlAndExtract(businessProfileId, url) {
        console.log(`[Scraper] Starting crawl for URL: ${url}`);
        // 1. Create ScrapeJob record (robust to DB connection failure)
        let jobRecord = null;
        try {
            jobRecord = await prisma_1.prisma.scrapeJob.create({
                data: {
                    business_profile_id: businessProfileId,
                    url,
                    status: 'RUNNING',
                    confidence_score: 0.0,
                    extracted_data: {}
                }
            });
        }
        catch (dbErr) {
            console.warn('[Scraper DB Warning] prisma.scrapeJob table not ready or DB expired, running in memory-only:', dbErr.message);
        }
        const fallbackProfile = {
            business_name: "Pre-Closure AI Client",
            industry: "Software / B2B",
            services: ["AI Automation Setup", "Lead Scoring Integration"],
            pricing: ["Professional: $99/mo", "Enterprise: $199/mo"],
            target_audience: ["Agencies", "High-ticket Coaches"],
            customer_pain_points: ["Chasing bad leads", "Low call booking rates"],
            value_propositions: ["Qualify leads 24/7", "Double closing rates"],
            faqs: [{ q: "How long is the trial?", a: "We offer a 14-day free trial on our Enterprise plan." }],
            common_objections: [{ objection: "Is it hard to integrate?", response: "No, it integrates with one script tag." }],
            booking_links: [url],
            social_proof: ["Used by 50+ B2B agencies"]
        };
        try {
            const baseResponse = await fetch(url, { signal: AbortSignal.timeout(10000) });
            if (!baseResponse.ok)
                throw new Error(`Homepage returned status ${baseResponse.status}`);
            const homeHtml = await baseResponse.text();
            const $ = cheerio_1.default.load(homeHtml);
            // Clean homepage content
            $('script, style, iframe, nav, footer, header').remove();
            const homeText = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 5000);
            // Collect target links on home page matching prioritised subpages
            const subpagesToCrawl = [];
            const priorityPatterns = [/about/i, /service/i, /pricing/i, /faq/i, /contact/i, /book/i];
            $('a[href]').each((_, elem) => {
                const href = $(elem).attr('href') || '';
                let absoluteUrl = '';
                try {
                    absoluteUrl = new URL(href, url).href;
                }
                catch {
                    return;
                }
                // Must be same origin
                const homeOrigin = new URL(url).origin;
                if (!absoluteUrl.startsWith(homeOrigin))
                    return;
                // Matches priority patterns and not already scheduled
                if (priorityPatterns.some(p => p.test(href)) && !subpagesToCrawl.includes(absoluteUrl) && absoluteUrl !== url) {
                    if (subpagesToCrawl.length < 5) {
                        subpagesToCrawl.push(absoluteUrl);
                    }
                }
            });
            console.log(`[Scraper] Found ${subpagesToCrawl.length} subpages to crawl:`, subpagesToCrawl);
            // 2. Fetch prioritized subpages
            let aggregatedText = `HOMEPAGE CONTENT:\n${homeText}\n\n`;
            for (const subpageUrl of subpagesToCrawl) {
                console.log(`[Scraper] Crawling subpage: ${subpageUrl}`);
                const subpageText = await this.fetchPageText(subpageUrl);
                if (subpageText) {
                    aggregatedText += `SUBPAGE CONTENT (${subpageUrl}):\n${subpageText}\n\n`;
                }
            }
            // Limit overall text sent to the LLM to 15,000 characters
            const cleanedInput = aggregatedText.substring(0, 15000);
            // 3. Call Llama 3.3-70b on NVIDIA NIM to extract structured profile
            const apiKey = process.env.NGC_API_KEY || process.env.MISTRAL_API_KEY;
            if (!apiKey || !apiKey.startsWith('nvapi-')) {
                throw new Error("Nvidia API key not configured.");
            }
            const prompt = `You are an elite B2B Knowledge Extraction AI. 
Analyze the crawled website text content below and extract structured business profile intelligence.
Generate a valid, raw JSON response containing EXACTLY these keys. Fill in values based strictly on crawled facts, or infer them logically from context if not explicitly mentioned.

{
  "business_name": "<string - company brand name>",
  "industry": "<string - e.g. B2B Marketing, Coaching, SaaS>",
  "services": ["<string - service name 1>", "<string - service name 2>"],
  "pricing": ["<string - pricing tier or cost structures>"],
  "target_audience": ["<string - target buyer profiles>"],
  "customer_pain_points": ["<string - major problems solved>"],
  "value_propositions": ["<string - core benefits of choosing them>"],
  "faqs": [
    { "q": "<string - frequently asked question>", "a": "<string - concise helpful answer>" }
  ],
  "common_objections": [
    { "objection": "<string - potential customer objection>", "response": "<string - response strategy>" }
  ],
  "booking_links": ["<string - Calendly, Cal.com, or schedule URLs found>"],
  "social_proof": ["<string - client names, case studies, or testimonial snippets>"]
}

CRITICAL: Output raw JSON only. Do not wrap in markdown code blocks. No other text.

WEBSITE CONTENT:
${cleanedInput}`;
            console.log("[Scraper] Sending text payload to Llama-3.3-70b on NVIDIA NIM...");
            const llmResponse = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'meta/llama-3.3-70b-instruct',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.1,
                    max_tokens: 1500
                }),
                signal: AbortSignal.timeout(45000) // 45s timeout
            });
            if (!llmResponse.ok) {
                throw new Error(`LLM API returned status ${llmResponse.status}`);
            }
            const llmJson = (await llmResponse.json());
            let rawContent = (llmJson.choices[0].message.content || '{}').trim();
            if (rawContent.startsWith('```')) {
                rawContent = rawContent.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
            }
            const extractedProfile = JSON.parse(rawContent);
            // 4. Calculate Confidence Score
            let score = 0;
            if (extractedProfile.business_name && extractedProfile.business_name !== 'Pre-Closure AI Client')
                score += 15;
            if (extractedProfile.industry)
                score += 10;
            if (extractedProfile.services && extractedProfile.services.length > 0)
                score += 15;
            if (extractedProfile.pricing && extractedProfile.pricing.length > 0)
                score += 15;
            if (extractedProfile.target_audience && extractedProfile.target_audience.length > 0)
                score += 10;
            if (extractedProfile.faqs && extractedProfile.faqs.length > 0)
                score += 15;
            if (extractedProfile.common_objections && extractedProfile.common_objections.length > 0)
                score += 10;
            if (extractedProfile.booking_links && extractedProfile.booking_links.length > 0)
                score += 10;
            console.log(`[Scraper] Extraction finished with confidence score: ${score}%`);
            // 5. Update DB ScrapeJob as COMPLETED
            if (jobRecord) {
                try {
                    await prisma_1.prisma.scrapeJob.update({
                        where: { id: jobRecord.id },
                        data: {
                            status: 'COMPLETED',
                            confidence_score: score,
                            extracted_data: extractedProfile
                        }
                    });
                }
                catch { }
            }
            return {
                status: 'SUCCESS',
                confidence_score: score,
                profile: extractedProfile
            };
        }
        catch (e) {
            console.error('[Scraper Error] Scrape run failed, executing fallback template:', e.message);
            // Update DB ScrapeJob as FAILED
            if (jobRecord) {
                try {
                    await prisma_1.prisma.scrapeJob.update({
                        where: { id: jobRecord.id },
                        data: {
                            status: 'FAILED',
                            confidence_score: 0.0,
                            extracted_data: fallbackProfile
                        }
                    });
                }
                catch { }
            }
            return {
                status: 'FALLBACK',
                confidence_score: 15.0,
                profile: fallbackProfile
            };
        }
    }
}
exports.ScraperService = ScraperService;
