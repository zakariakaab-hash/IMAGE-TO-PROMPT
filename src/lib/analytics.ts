/**
 * Privacy-friendly event tracking abstraction
 */

export type AnalyticsEvent =
  | 'image_uploaded'
  | 'prompt_generated'
  | 'prompt_copied'
  | 'prompt_regenerated'
  | 'mode_selected'
  | 'target_model_selected'
  | 'example_clicked'
  | 'download_txt'
  | 'download_json'
  | 'signup_started'
  | 'signup_completed';

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
  // Safe console telemetry / ready for Cloudflare Web Analytics / custom beacon
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    console.debug(`[Analytics Event] ${event}`, properties || {});
  }
}
