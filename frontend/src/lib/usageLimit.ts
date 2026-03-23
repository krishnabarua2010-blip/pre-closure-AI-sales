const MESSAGE_LIMIT = 50;

let usageMap: Record<string, number> = {};

export function canSendMessage(business: string) {
  if (!usageMap[business]) usageMap[business] = 0;
  return usageMap[business] < MESSAGE_LIMIT;
}

export function recordMessage(business: string) {
  if (!usageMap[business]) usageMap[business] = 0;
  usageMap[business]++;
}
