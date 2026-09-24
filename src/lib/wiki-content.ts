// Wiki content — file-based (no DB), rendered by /src/app/wiki.
// Sections group articles; articles are plain TSX blocks (XSS-safe by design:
// no dangerouslySetInnerHTML anywhere).

export type WikiBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; text: string }
  | { type: "note"; text: string };

export interface WikiArticle {
  slug: string;
  section: string;
  title: string;
  icon: string;
  updated: string;
  blocks: WikiBlock[];
}

export interface WikiSection {
  name: string;
  icon: string;
  description: string;
}

export const WIKI_SECTIONS: WikiSection[] = [
  {
    name: "UltimateImprovments",
    icon: "fa-solid fa-plug",
    description: "The UltimateImprovments Minecraft plugin suite: features, commands and systems.",
  },
];

export const WIKI_ARTICLES: WikiArticle[] = [
  {
    slug: "reports-reputation-statuses",
    section: "UltimateImprovments",
    title: "Reports, Reputation & Account Standing",
    icon: "fa-solid fa-star-half-stroke",
    updated: "2026-09-24",
    blocks: [
      {
        type: "p",
        text: "UltimateImprovments ships a connected moderation stack: players file reports, the staff team resolves them with verdicts, and every outcome feeds two independent reputation scales — a numeric score and a Discord-style Account Standing.",
      },
      { type: "h2", text: "Report system" },
      {
        type: "p",
        text: "Any player can report another player with /ui report. Reports live in the database, expire automatically, and land in the moderation queue for the staff team.",
      },
      {
        type: "list",
        items: [
          "/ui report <player> <reason> — file a report (one active report at a time)",
          "/ui repstatus — check the status of your own report",
          "/ui reports list|add|remove — staff: manage the moderation queue",
          "/ui modreport <name> — staff: open a moderation session for a report",
        ],
      },
      {
        type: "p",
        text: "A moderator handles a report in a chat-guided session: first a written conclusion, then one of three verdicts — Accepted (confirmed), Declined (rejected) or Closed.",
      },
      { type: "h2", text: "Numeric reputation" },
      {
        type: "p",
        text: "The first scale is an integer score issued by staff. Players cannot give reputation to each other — only the team can, and every change is logged and broadcast to other staff for transparency.",
      },
      {
        type: "list",
        items: [
          "/ui rep [player] — view reputation and standing (everyone)",
          "/ui rep give <player> <+/-N> [reason] — change the score (staff), limited to ±100 per change",
          "/ui rep set <player> <N> — set an absolute value (admin)",
          "/ui rep top — leaderboard",
          "/ui rep history [player] — last changes with actor, source and reason",
        ],
      },
      {
        type: "note",
        text: "Every give/set is recorded in the reputation log (who, whom, how much, why) and announced to staff with the ui.rep.notify permission.",
      },
      { type: "h2", text: "Automatic adjustments" },
      {
        type: "p",
        text: "Moderation outcomes move the score automatically. Amounts are config-toggled (0 disables a source):",
      },
      {
        type: "list",
        items: [
          "Confirmed report verdict — −5 to the reported player",
          "Warn — −1",
          "Mute — −3",
          "Ban — −10",
        ],
      },
      { type: "h2", text: "Account Standing (second scale)" },
      {
        type: "p",
        text: "The second scale mirrors Discord's account standings. It is issued separately by moderators and does not depend on the numeric score — a player can be Suspended with a positive score or All good with zero reputation.",
      },
      {
        type: "list",
        items: [
          "✔ All good — no issues, full trust",
          "⚠ Limited — minor issues",
          "⚠ Very limited — serious violations",
          "⛔ At risk — one step from suspension",
          "☠ Suspended — restricted account",
        ],
      },
      {
        type: "code",
        text: "/ui rep status <player> <allgood|limited|verylimited|atrisk|suspended|none>",
      },
      { type: "h2", text: "Permissions" },
      {
        type: "list",
        items: [
          "ui.command.rep — view reputation",
          "ui.command.rep.give — change the numeric score",
          "ui.command.rep.set — absolute set",
          "ui.command.rep.status — issue Account Standing",
          "ui.command.rep.history.other — view other players' history",
          "ui.rep.notify — receive staff change notifications",
        ],
      },
    ],
  },
];
