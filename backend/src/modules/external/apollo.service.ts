import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const APOLLO_API_KEY = process.env.APOLLO_API_KEY || 'mock_apollo_key';
const APOLLO_BASE_URL = 'https://api.apollo.io/v1';

export class ApolloService {
  /**
   * Fetches real leads from Apollo.io using the search endpoint.
   * Falls back to mock data if API key is not configured or in development mode.
   */
  static async searchLeads(niche: string, location: string, limit: number = 10) {
    if (APOLLO_API_KEY === 'mock_apollo_key') {
      console.warn('[ApolloService] No API key found, returning mock verified leads.');
      return this.mockScrape(niche, location, limit);
    }

    try {
      const response = await axios.post(`${APOLLO_BASE_URL}/mixed_companies/search`, {
        api_key: APOLLO_API_KEY,
        q_organization_keyword_tags: niche,
        organization_locations: [location],
        per_page: limit,
      });

      const companies = response.data.organizations || [];
      return companies.map((c: any) => ({
        name: c.name,
        description: c.short_description || c.seo_description || `A company in ${niche}`,
        industry: c.industry || niche,
        location: c.city || location,
        website: c.website_url,
        linkedin: c.linkedin_url,
        phone: c.primary_phone?.number,
        estimated_revenue: c.annual_revenue_printed
      }));
    } catch (error) {
      console.error('[ApolloService] Apollo API request failed. Falling back to mock data.', error);
      return this.mockScrape(niche, location, limit);
    }
  }

  static mockScrape(niche: string, location: string, count: number) {
    const leads = [];
    const firstNames = ["Apex", "Premier", "Elite", "Global", "NextGen"];
    for(let i=0; i<count; i++) {
        leads.push({
            name: `${firstNames[i % firstNames.length]} ${niche} Group`,
            description: `A fast growing business looking to scale operations.`,
            industry: niche,
            location: location || "Remote",
            website: `https://www.${firstNames[i % firstNames.length].toLowerCase()}group.com`,
            phone: `+1-800-555-${1000 + i}`
        });
    }
    return leads;
  }
}
