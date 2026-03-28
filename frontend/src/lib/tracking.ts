import api from './api';

export const trackEvent = async (eventName: string, metadata: Record<string, any> = {}) => {
  try {
    await api.post('/analytics/track', { event_name: eventName, metadata });
    console.log(`[TRACK] ${eventName}`, metadata);
  } catch (err) {
    console.error('Tracking error:', err);
  }
};
