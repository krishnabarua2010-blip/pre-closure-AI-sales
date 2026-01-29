type HotLead = {
  business: string;
  message: string;
  timestamp: string;
};

let hotLeads: HotLead[] = [];

export function addHotLead(lead: HotLead) {
  hotLeads.unshift(lead);
}

export function getHotLeads() {
  return hotLeads;
}
