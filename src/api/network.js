import { API_CONFIG } from "./settings.js";

export const NETWORK_PROFILES = {
  normal: { label: "Normal (0.5-3 s, 5% errors)", minDelay: 500, maxDelay: 3000, errorChance: 0.05 },
  slow: { label: "Slow, for race tests (0.3-6 s)", minDelay: 300, maxDelay: 6000, errorChance: 0 },
  unstable: { label: "Unstable (30% errors)", minDelay: 300, maxDelay: 1500, errorChance: 0.3 },
  fast: { label: "Fast and reliable", minDelay: 150, maxDelay: 500, errorChance: 0 },
};

export function applyNetworkProfile(name) {
  const { minDelay, maxDelay, errorChance } = NETWORK_PROFILES[name];
  Object.assign(API_CONFIG, { minDelay, maxDelay, errorChance });
}
