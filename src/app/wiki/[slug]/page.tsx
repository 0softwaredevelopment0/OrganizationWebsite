import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WIKI_ARTICLES, type WikiBlock } from "@/lib/wiki-content";

export function generateStaticParams() {
  return WIKI_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = WIKI_ARTICLES.find((a) => a.slug === slug);
  return { title: article ? article.title : "Wiki" };
}

function Block({ block }: { block: WikiBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: "var(--text-primary)" }}>
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="text-xl font-semibold mt-8 mb-3" style={{ color: "var(--text-primary)" }}>
          {block.text}
        </h3>
      );
    case "list":
      return (
        <ul className="mb-6 space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <span style={{ color: "var(--accent-cyan)" }}>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "code":
      return (
        <pre
          className="mb-6 p-4 rounded-xl overflow-x-auto text-sm font-mono"
          style={{ background: "rgba(0,0,0,0.35)", border: "1px solid var(--border-color)" }}
        >
          <code style={{ color: "var(--accent-cyan)" }}>{block.text}</code>
        </pre>
      );
    case "note":
      return (
        <div
          className="mb-6 p-4 rounded-xl text-sm flex gap-3"
          style={{
            background: "rgba(0, 212, 255, 0.07)",
            border: "1px solid rgba(0, 212, 255, 0.25)",
            color: "var(--text-secondary)",
          }}
        >
          <i className="fa-solid fa-circle-info mt-0.5" style={{ color: "var(--accent-cyan)" }}></i>
          <span>{block.text}</span>
        </div>
      );
    default:
      return (
        <p className="mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {block.text}
        </p>
      );
  }
}

export default async function WikiArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = WIKI_ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  const sectionArticles = WIKI_ARTICLES.filter(
    (a) => a.section === article.section && a.slug !== article.slug
  );

  return (
    <div className="px-6 py-16">
      <div className="mx-auto" style={{ maxWidth: "800px" }}>
        <Link
          href="/wiki"
          className="inline-flex items-center gap-2 text-sm font-semibold mb-8 transition-colors hover:gap-3"
          style={{ color: "var(--accent-cyan)" }}
        >
          <i className="fa-solid fa-arrow-left"></i> Back to wiki
        </Link>

        <article>
          <div className="flex items-center gap-3 mb-2">
            <i className={article.icon} style={{ color: "var(--accent-cyan)" }}></i>
            <span className="text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
              {article.section}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{article.title}</h1>
          <div className="text-xs mb-8" style={{ color: "var(--text-muted)" }}>
            Updated {article.updated}
          </div>

          <div>
            {article.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>
        </article>

        {sectionArticles.length > 0 && (
          <div className="mt-14">
            <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              More in {article.section}
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {sectionArticles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/wiki/${a.slug}`}
                  className="flex items-center gap-2 p-4 rounded-xl border transition-all hover:scale-[1.02]"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <i className={a.icon} style={{ color: "var(--accent-purple)" }}></i>
                  <span className="font-semibold">{a.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
