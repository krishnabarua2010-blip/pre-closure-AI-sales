/**
 * Features Store
 * Provides global access to unlocked features throughout the app
 * This is a simple localStorage-backed store
 */

import { Features } from "./types";

const FEATURES_STORAGE_KEY = "app-features";

export function getFeaturesFromStorage(): Features | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(FEATURES_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function saveFeaturestoStorage(features: Features): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(FEATURES_STORAGE_KEY, JSON.stringify(features));
}

export function hasFeature(featureName: keyof Features): boolean {
  const features = getFeaturesFromStorage();
  return features ? Boolean(features[featureName]) : false;
}

export function useFeatures(): Features | null {
  if (typeof window === "undefined") return null;
  return getFeaturesFromStorage();
}
