/** Host your policies at these URLs or override via env (same URLs as App Store Connect). */
export const PRIVACY_POLICY_URL =
  process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL ?? "https://jiu-tracker.com/privacy";

export const TERMS_OF_USE_URL =
  process.env.EXPO_PUBLIC_TERMS_OF_USE_URL ?? "https://jiu-tracker.com/terms";
