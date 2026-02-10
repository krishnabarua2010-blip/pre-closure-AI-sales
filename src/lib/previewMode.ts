/**
 * Preview Mode Utility
 * Manages limited preview access (10-20 messages) without payment
 */

const PREVIEW_MESSAGE_LIMIT = 15; // Mid-range: 10-20 messages
const PREVIEW_KEY = 'auto-closure-preview-mode';
const PREVIEW_COUNT_KEY = 'auto-closure-preview-count';

export function isPreviewMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(PREVIEW_KEY) === 'true';
}

export function getPreviewMessageCount(): number {
  if (typeof window === 'undefined') return 0;
  const count = localStorage.getItem(PREVIEW_COUNT_KEY);
  return count ? parseInt(count, 10) : 0;
}

export function getRemainingPreviewMessages(): number {
  const used = getPreviewMessageCount();
  return Math.max(0, PREVIEW_MESSAGE_LIMIT - used);
}

export function hasReachedPreviewLimit(): boolean {
  return getPreviewMessageCount() >= PREVIEW_MESSAGE_LIMIT;
}

export function incrementPreviewMessageCount(): number {
  if (typeof window === 'undefined') return 0;
  const current = getPreviewMessageCount();
  const next = current + 1;
  localStorage.setItem(PREVIEW_COUNT_KEY, String(next));
  return next;
}

export function startPreviewMode(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PREVIEW_KEY, 'true');
  localStorage.setItem(PREVIEW_COUNT_KEY, '0');
}

export function endPreviewMode(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PREVIEW_KEY);
  localStorage.removeItem(PREVIEW_COUNT_KEY);
}

export function resetPreviewMode(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PREVIEW_COUNT_KEY, '0');
}

export const PREVIEW_LIMIT = PREVIEW_MESSAGE_LIMIT;
