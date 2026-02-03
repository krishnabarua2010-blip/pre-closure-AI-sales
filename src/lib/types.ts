export type Profile = {
  id?: string;
  business_id?: string;
  plan_name?: string;
  messages_used?: number;
  business_name?: string;
  slug?: string;
  description?: string;
  services?: string;
  faqs?: string;
  tone?: string;
};

export type DailySummary = {
  total_chats: number;
  hot_count: number;
  warm_count: number;
  cold_count: number;
  ai_closed_count: number;
  note?: string;
};
