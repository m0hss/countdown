import type { Registration } from "./types";
const people = [
  ["Mika Ellery", "mika-ellery", 128],
  ["Rowan Vale", "rowan-vale", 96],
  ["Jules Arden", "jules-arden", 84],
  ["Sage Marlow", "sage-marlow", 72],
  ["Emery Wren", "emery-wren", 65],
  ["Kit Solace", "kit-solace", 58],
  ["Avery Linden", "avery-linden", 51],
  ["Remy Ashby", "remy-ashby", 46],
  ["Indigo Fenn", "indigo-fenn", 40],
  ["Blair Hollis", "blair-hollis", 36],
  ["Quinn Alder", "quinn-alder", 31],
  ["Ellis Cove", "ellis-cove", 27],
  ["Noa Bramble", "noa-bramble", 24],
  ["Robin Aster", "robin-aster", 21],
  ["Finley Moss", "finley-moss", 18],
  ["River Lark", "river-lark", 15],
  ["Shiloh Reed", "shiloh-reed", 12],
  ["Arden Frost", "arden-frost", 9],
  ["Cleo Haven", "cleo-haven", 6],
  ["Wren Bellamy", "wren-bellamy", 3],
] as const;
/** Fictional identities. Never request remote avatars for these usernames. */
export const registrations: Registration[] = people.map(
  ([name, username, referrals], index) => ({
    id: `demo-${index + 1}`,
    name,
    username,
    referrals,
    number: index === 0 ? 100 : 100 + index,
    fixture: true,
    dailyReferrals: Math.max(0, 12 - Math.floor(index / 2)),
    lastActiveDays: Math.floor(index / 7),
    role: ["Platform engineer", "Systems architect", "Independent builder"][
      index % 3
    ],
  }),
);

export const authors = [
  { id: "mika", name: "Mika Ellery", role: "Edge systems engineer" },
  { id: "rowan", name: "Rowan Vale", role: "Distributed systems architect" },
  { id: "jules", name: "Jules Arden", role: "Developer experience engineer" },
];
export const sessions = [
  {
    id: "edge-ama",
    title: "Edge Runtime & WebAssembly AMA",
    host: "Mika Ellery",
    offsetHours: 54,
    durationMinutes: 45,
  },
  {
    id: "mesh-workshop",
    title: "Federated Query Workshop",
    host: "Rowan Vale",
    offsetHours: 78,
    durationMinutes: 60,
  },
];
export const keynoteScenes = [
  {
    title: "A closer edge. A faster start.",
    text: "Bring compute closer to the work. Our fictional edge runtime starts small and scales with the idea.",
    kind: "orbit",
  },
  {
    title: "Every region. One shared state.",
    text: "Watch a sample write travel through a local simulation of a distributed data mesh.",
    kind: "network",
  },
  {
    title: "Build the next chapter together.",
    text: "Five releases, one connected toolkit. Explore the demo, claim a pass, and invite your people.",
    kind: "spark",
  },
];
export interface ReleaseSample {
  command: string;
  logs: string[];
  baseline: number;
  distributed: number;
  throughput: number[];
  features: { title: string; description: string; detail: string }[];
  code: string;
}
const commonFeatures = [
  {
    title: "State-based coordination",
    description:
      "Explore a sample flow where independent regions converge on a shared view of the world.",
    detail: "LOCAL SIMULATION · PREDICTABLE STATE",
  },
  {
    title: "Context at the edge",
    description:
      "Carry the important details between regions without losing the thread of the work.",
    detail: "FICTIONAL ARCHITECTURE PREVIEW",
  },
  {
    title: "A simpler developer experience",
    description:
      "Follow a small example from the first event to a synchronized result.",
    detail: "ZERO EXTERNAL SERVICES REQUIRED",
  },
];
export const releaseSamples: Record<number, ReleaseSample> = Object.fromEntries(
  ["edge", "cache", "mesh", "replay", "ops"].map((key, index) => [
    index + 1,
    {
      command: `countdown ${key} --region=global --preview`,
      logs: [
        `[INIT] Local ${key} preview ready`,
        "[LINK] Simulated regions connected: AMS · SFO · SIN",
        "[SYNC] Waiting for your first event",
      ],
      baseline: 240,
      distributed: 12 + index * 2,
      throughput: [18, 29, 25, 46, 62, 58, 82, 96],
      features: commonFeatures,
      code: `type Region = "ams" | "sfo" | "sin";\n\n// A local example — no service connection required.\nconst replicas = new Map<Region, number>();\n\nexport function broadcast(value: number) {\n  for (const region of ["ams", "sfo", "sin"] as const) {\n    replicas.set(region, value);\n  }\n  return Object.fromEntries(replicas);\n}\n\nbroadcast(42);`,
    },
  ]),
);
export const testimonial = {
  quote:
    "The most useful tools make a complicated idea feel approachable. This demo gave our fictional team a shared place to start.",
  name: "Emery Wren",
  role: "Platform engineer · Northstar Workshop",
};

export const telemetry = {
  peers: "48",
  messages: "428",
  loss: "0.00%",
  uptime: "99.99%",
  driftIdle: "0.012",
  driftSyncing: "0.009",
  coldStart: "0.18",
};
