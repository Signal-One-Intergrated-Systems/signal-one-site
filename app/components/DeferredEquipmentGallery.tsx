"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";

/** Preserve genuine server-rendered content until its interactive controls are ready. */
export default function DeferredEquipmentGallery({
  children,
  compact = false,
}: {
  children: ReactNode;
  compact?: boolean;
}) {
  const [Gallery, setGallery] = useState<ComponentType<{
    compact?: boolean;
  }> | null>(null);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let mounted = true;
    const load = () => {
      void import("./EquipmentGallery")
        .then((module) => {
          if (mounted) setGallery(() => module.default);
        })
        .catch(() => undefined);
    };
    if (!root.current || !("IntersectionObserver" in window)) {
      load();
      return () => {
        mounted = false;
      };
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          load();
          observer.disconnect();
        }
      },
      { rootMargin: "150px 0px" },
    );
    observer.observe(root.current);
    return () => {
      mounted = false;
      observer.disconnect();
    };
  }, []);
  return (
    <div
      ref={root}
      className="deferred-equipment"
      data-enhanced={Gallery !== null}
    >
      {Gallery ? <Gallery compact={compact} /> : children}
    </div>
  );
}
