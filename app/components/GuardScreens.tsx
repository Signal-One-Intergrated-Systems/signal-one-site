import Image from "next/image";
import { guardScreens, type GuardScreen } from "../lib/guardScreens";

/** A named slot for genuine 1GUARD screenshots. Renders nothing while lib/guardScreens.ts is empty. */
export default function GuardScreens({ slot, className = "" }: { slot: GuardScreen["slot"]; className?: string }) {
  const screens = guardScreens.filter((screen) => screen.slot === slot);
  if (screens.length === 0) return null;
  return (
    <div className={"guard-screens " + className} data-guard-screens={slot}>
      {screens.map((screen) => (
        <figure key={screen.alt} className="m-0">
          <div className="product-window">
            <Image src={screen.src} alt={screen.alt} sizes="(min-width: 1024px) 560px, 92vw" className="block h-auto w-full" />
          </div>
          <figcaption className="photo-caption mt-2">{screen.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
