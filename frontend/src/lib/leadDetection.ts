export function isHotLead(message: string) {
  const hotKeywords = [
    "price",
    "cost",
    "join",
    "buy",
    "book",
    "sign up",
    "today",
    "available",
    "membership",
  ];

  const text = message.toLowerCase();
  return hotKeywords.some((word) => text.includes(word));
}
