"use client";
import { useEffect, useState } from "react";
import { launchConfig as c } from "@/launch.config";
import { OrbitalMark } from "./brand";
export function QrCode({ value }: { value: string }) {
  const [code, setCode] = useState<{ size: number; path: string } | null>(null);
  useEffect(() => {
    let active = true;
    if (!value) return;
    import("qrcode")
      .then(({ default: QRCode }) => {
        const { modules } = QRCode.create(value, { errorCorrectionLevel: "M" });
        let path = "";
        for (let row = 0; row < modules.size; row++)
          for (let col = 0; col < modules.size; col++)
            if (modules.get(row, col)) path += `M${col + 4} ${row + 4}h1v1h-1z`;
        if (active) setCode({ size: modules.size + 8, path });
      })
      .catch(() => {
        if (active) setCode(null);
      });
    return () => {
      active = false;
    };
  }, [value]);
  if (!code)
    return (
      <span className="qr-placeholder">
        <OrbitalMark />
      </span>
    );
  return (
    <svg
      className="ticket-qr"
      role="img"
      aria-label={c.pass.qrDescription}
      viewBox={`0 0 ${code.size} ${code.size}`}
      shapeRendering="crispEdges"
    >
      <rect width={code.size} height={code.size} fill="var(--qr-bg)" />
      <path d={code.path} fill="var(--qr-fg)" />
    </svg>
  );
}
