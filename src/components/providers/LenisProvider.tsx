"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";

export function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.12, duration: 1.0, smoothWheel: true, autoResize: true }}>
      {children}
    </ReactLenis>
  );
}
