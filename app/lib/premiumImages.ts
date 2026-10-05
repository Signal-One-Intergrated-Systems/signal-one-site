const base =
  process.env.NEXT_PUBLIC_PREMIUM_IMAGE_BASE ||
  "https://premium-images-production.up.railway.app";

const version = "natural-photo-set-20261005";

export const premiumImages = {
  hero: `${base}/assets/hero-integrated-security.png?v=${version}`,
  siteOperations: `${base}/assets/guard-site-operations.png?v=${version}`,
  radioTracking: `${base}/assets/field-radio-tracking.png?v=${version}`,
  controlRoomDay: `${base}/assets/control-room-day.png?v=${version}`,
  marketplace: `${base}/assets/workforce-briefing.png?v=${version}`,
  clientReporting: `${base}/assets/proof-client-reporting.png`,
  warehouseSecurity: `${base}/assets/warehouse-security.png?v=${version}`,
  workforceBriefing: `${base}/assets/workforce-briefing.png?v=${version}`,
  controlRoomNight: `${base}/assets/estate-response-night.png?v=${version}`,
  estateResponseNight: `${base}/assets/estate-response-night.png?v=${version}`,
} as const;
