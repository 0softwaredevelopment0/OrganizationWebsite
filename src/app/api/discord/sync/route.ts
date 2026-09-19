import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// POST /api/discord/sync — receive Discord messages and create news.
//
// Security:
//  - The payload must be signed by the bot: an HMAC-SHA256 signature of the
//    raw request body, sent either as `X-Signature: v1=<hex>` or in the
//    `X-Signature` header (raw hex) — computed with DISCORD_WEBHOOK_SECRET.
//  - As a fallback, the legacy `?secret=<value>` query parameter is accepted
//    (compared with a timing-safe comparison), but only when the bot has not
//    been configured to sign requests (i.e. no X-Signature header present).
//  - If DISCORD_WEBHOOK_SECRET is not configured at all, the endpoint is
//    disabled and returns 503 instead of accepting unsigned posts.

const SYNC_URL = process.env.NEXTAUTH_URL
  ? `${process.env.NEXTAUTH_URL.replace(/\/$/, "")}/api/discord/sync`
  : "/api/discord/sync";

function signaturesMatch(expectedHex: string, receivedHex: string): boolean {
  const a = Buffer.from(expectedHex, "utf8");
  const b = Buffer.from(receivedHex, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function verifySignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader) return false;
  const received = signatureHeader.startsWith("v1=") ? signatureHeader.slice(3) : signatureHeader;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  try {
    return signaturesMatch(expected, received.trim().toLowerCase());
  } catch {
    return false;
  }
}

export async function GET() {
  // Small discovery endpoint so the bot can learn where to POST and that
  // signing is required. No sensitive data.
  return NextResponse.json({
    url: SYNC_URL,
    auth: "hmac-sha256",
    header: "X-Signature: v1=<hex hmac-sha256 of raw body>",
    enabled: Boolean(process.env.DISCORD_WEBHOOK_SECRET),
  });
}

export async function POST(req: NextRequest) {
  const secret = process.env.DISCORD_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Discord sync is not configured" },
      { status: 503 }
    );
  }

  const rawBody = await req.text();
  const signatureHeader = req.headers.get("x-signature");
  const querySecret = req.nextUrl.searchParams.get("secret");

  // 1) Preferred: HMAC-signed request (timing-safe compare).
  let authorized = verifySignature(rawBody, signatureHeader, secret);

  // 2) Legacy fallback: ?secret= query parameter (timing-safe compare).
  //    Only honored when the request is not signed, so a leaked query secret
  //    cannot be replayed against a properly signed endpoint.
  if (!authorized && !signatureHeader && querySecret) {
    authorized = signaturesMatch(secret, querySecret);
  }

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = JSON.parse(rawBody);

    // Handle Discord webhook payload
    const { id, channel_id, guild_id, author, content, attachments, timestamp } = body;

    if (!id || typeof id !== "string" || !content || typeof content !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Check if message already synced
    const existing = await prisma.discordMessage.findUnique({ where: { id } });
    if (existing) {
      return NextResponse.json({ message: "Already synced" });
    }

    // Save Discord message
    await prisma.discordMessage.create({
      data: {
        id,
        channelId: typeof channel_id === "string" ? channel_id : "",
        guildId: typeof guild_id === "string" ? guild_id : null,
        authorId: author?.id || "unknown",
        authorName: author?.username || "Unknown",
        authorAvatar: author?.avatar
          ? `https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png`
          : null,
        content,
        attachments: attachments?.length ? JSON.stringify(attachments) : null,
        createdAt: new Date(timestamp || Date.now()),
      },
    });

    // Auto-create a news post from Discord message if it looks like a news announcement
    // (messages starting with !news or marked with specific tag)
    if (content.startsWith("!news") || content.startsWith("📢")) {
      const newsContent = content.replace(/^!news\s*/i, "").replace(/^📢\s*/, "");
      const firstLine = newsContent.split("\n")[0].slice(0, 80);

      let slug = firstLine
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 80) || `discord-${Date.now().toString(36)}`;

      // Ensure unique slug
      const existingSlug = await prisma.news.findUnique({ where: { slug } });
      if (existingSlug) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }

      // Find an admin user for author
      const adminUser = await prisma.user.findFirst({ where: { role: "admin" } });

      await prisma.news.create({
        data: {
          title: firstLine || "News from Discord",
          content: newsContent,
          slug,
          published: true,
          authorId: adminUser?.id || "unknown",
          discordMessageId: id,
          discordChannelId: channel_id,
          syncedToDiscord: false,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Discord sync error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
