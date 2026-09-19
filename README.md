<div align="center">
  <br />
  <img src="https://avatars.githubusercontent.com/u/0?v=4" width="120" style="border-radius: 50%;" alt="Software Development" />

  # OrganizationWebsite

  ### Website of the Software Development organization

  <p align="center">
    <a href="https://github.com/0softwaredevelopment0/OrganizationWebsite/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/license-AGPLv3-blue.svg" alt="License: AGPL v3" />
    </a>
    <a href="https://nextjs.org/">
      <img src="https://img.shields.io/badge/Next.js-16-black" alt="Next.js 16" />
    </a>
    <a href="https://www.prisma.io/">
      <img src="https://img.shields.io/badge/Prisma-SQLite-green" alt="Prisma" />
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-5-blue" alt="TypeScript" />
    </a>
    <img src="https://img.shields.io/badge/status-Beta-orange" alt="Development status: Beta" />
  </p>

  <br />
</div>

---

## 📋 Overview

The organization website — a public face for the **[Software Development](https://github.com/0softwaredevelopment0)** GitHub organization. Features:

- **Landing page** — organization overview, project catalog from GitHub, community links
- **Blog/News** — post updates with cross-posting to Discord
- **Discord Chat** — send messages via webhook, message history in DB
- **GitHub Activity** — event logs with pagination, repo tabs, commit display
- **Admin Panel** — user management, roles (Owner/Admin), news, Discord webhook config
- **Authentication** — login via GitHub OAuth

## 🚀 Tech Stack

| Technology | Version | Purpose |
|-----------|--------|---------|
| **Next.js** | 16 | React framework (App Router) |
| **React** | 19 | UI library |
| **TypeScript** | 5 | Type safety |
| **Tailwind CSS** | 4 | Styling |
| **Prisma** | 6 | ORM (SQLite) |
| **NextAuth** | 4 | OAuth (GitHub) |

## 🏃 Getting Started

```bash
# Install dependencies
npm install

# Set up the database
npm run db:push

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Environment variables (`.env`):

| Variable | Purpose |
|----------|---------|
| `GITHUB_TOKEN` | GitHub API token (higher rate limits) |
| `GITHUB_USERNAME` | GitHub org name to fetch repos/activity for |
| `DISCORD_WEBHOOK_URL` | Discord webhook for news cross-posting and chat |

## 🐳 Docker

```bash
docker build -t organization-website .
docker run -p 3000:3000 organization-website
```

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPLv3)** — see [LICENSE](LICENSE).
