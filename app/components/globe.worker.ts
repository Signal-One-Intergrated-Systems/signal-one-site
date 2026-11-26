/// <reference lib="webworker" />
// Draws the hero globe off the main thread (DR-026). Messages from GlassGlobe.tsx only.
import { runGlobe, type GlobeController } from "./globeRenderer";

let controller: GlobeController | null = null;
let size = { width: 0, height: 0, dpr: 1 };

self.onmessage = (event: MessageEvent) => {
  const m = event.data;
  if (m.type === "init") {
    controller = runGlobe(m.canvas as OffscreenCanvas, { size: () => size, geoUrl: m.geoUrl, reduced: m.reduced });
  } else if (m.type === "size") {
    size = m.size;
    controller?.request();
  } else if (m.type === "visible") {
    controller?.setVisible(m.visible);
  } else if (m.type === "reduced") {
    controller?.setReduced(m.reduced);
  } else if (m.type === "stop") {
    controller?.stop();
    self.close();
  }
};
