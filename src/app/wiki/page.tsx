import Link from "next/link";
import type { Metadata } from "next";
import { WIKI_ARTICLES, WIKI_SECTIONS } from "@/lib/wiki-content";

export const metadata: Metadata = { title: "Wiki" };

export default function WikiPage() {
  return (
    <div className="px-6 py-16">
      <div className="mx-auto" style={{ maxWidth: "1100px" }}>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 flex items-center gap-3">
          <span
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border text-xl"
            style={{
              background: "linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(124, 58, 237, 0.1))",
              borderColor: "var(--border-color)",
              color: "var(--accent-cyan)",
            }}
          >
            <i className="fa-solid fa-book"></i>
          </span>
          Wiki
        </h1>
        <p className="text-base mb-12" style={{ color: "var(--text-secondary)", maxWidth: "600px" }}>
          Documentation for our projects — features, commands and systems
        </p>

        {WIKI_SECTIONS.map((section) => {
          const articles = WIKI_ARTICLES.filter((a) => a.section === section.name);
          return (
            <section key={section.name} className="mb-12">
              <div className="flex items-center gap-3 mb-2">
                <i className={section.icon} style={{ color: "var(--accent-purple)" }}></i>
                <h2 className="text-2xl font-bold">{section.name}</h2>
              </div>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                {section.description}
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                {articles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/wiki/${article.slug}`}
                    className="group block p-5 rounded-2xl border transition-all hover:scale-[1.02]"
                    style={{
                      background: "var(--bg-card, rgba(255,255,255,0.03))",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <i className={article.icon} style={{ color: "var(--accent-cyan)" }}></i>
                      <span className="font-bold text-lg group-hover:underline">{article.title}</span>
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Updated {article.updated}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
