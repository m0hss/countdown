"use client";
import { useState } from "react";
import { initials } from "@/lib/demo";
import { launchConfig as c } from "@/launch.config";
export function Avatar({
  name,
  username,
  fixture = false,
  small = false,
}: {
  name: string;
  username?: string;
  fixture?: boolean;
  small?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <span className={`avatar ${small ? "avatar-small" : ""}`}>
      <span aria-hidden>{initials(name)}</span>
      {username && !fixture && !failed && (
        // GitHub is optional; initials remain available offline and for fictional fixtures.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://github.com/${encodeURIComponent(username)}.png?size=160`}
          alt={`${c.ticket.avatar} ${name}`}
          onError={() => setFailed(true)}
          width={80}
          height={80}
        />
      )}
    </span>
  );
}
