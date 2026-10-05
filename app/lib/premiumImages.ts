const base =
  process.env.NEXT_PUBLIC_PREMIUM_IMAGE_BASE ||
  "https://premium-images-production.up.railway.app";

export const premiumImages = {
  hero: `${base}/assets/hero-integrated-security.png`,
  siteOperations: `${base}/assets/guard-site-operations.png`,
  radioTracking: `${base}/assets/field-radio-tracking.png`,
  controlRoomDay: `${base}/assets/control-room-day.png`,
  marketplace: `${base}/assets/marketplace-workforce.png`,
  clientReporting: `${base}/assets/proof-client-reporting.png`,
  warehouseSecurity: `${base}/assets/warehouse-security.png`,
  workforceBriefing: `${base}/assets/workforce-briefing.png`,
  controlRoomNight: `${base}/assets/control-room-night.png`,
  estateResponseNight: `${base}/assets/estate-response-night.png`,
} as const;
