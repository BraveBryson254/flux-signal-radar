"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, X, BookOpen, Newspaper, GraduationCap, BookMarked, Hash } from "lucide-react";
import { courses } from "@/lib/educationData";
import { books } from "@/lib/educationData";
import { articles, glossary } from "@/lib/articleData";
import { readingList } from "@/lib/readingListData";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  kind: "course" | "article" | "book" | "term" | "reading";
}

function buildIndex(): SearchResult[] {
  const results: SearchResult[] = [];
  courses.forEach((c) =>
    results.push({ id: c.id, title: c.title, subtitle: `Course · ${c.category}`, href: `/academy/${c.id}`, kind: "course" })
  );
  articles.forEach((a) =>
    results.push({ id: a.id, title: a.title, subtitle: `Article · ${a.category}`, href: "/articles", kind: "article" })
  );
  books.forEach((b) =>
    results.push({ id: b.id, title: b.title, subtitle: `Library · ${b.author}`, href: `/library/${b.id}`, kind: "book" })
  );
  glossary.forEach((g) =>
    results.push({ id: g.term, title: g.term, subtitle: "Glossary term", href: "/articles", kind: "term" })
  );
  readingList.forEach((r) =>
    results.push({ id: r.id, title: r.title, subtitle: `Reading list · ${r.author}`, href: "/academy/reading-list", kind: "reading" })
  );
  return results;
}

const kindIcon: Record<SearchResult["kind"], React.ComponentType<{ size?: number; className?: string }>> = {
  course: GraduationCap,
  article: Newspaper,
  book: BookOpen,
  term: Hash,
  reading: BookMarked,
};

export default function AcademySearch() {
  const [query, setQuery] = useState("");
  const index = useMemo(() => buildIndex(), []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return index.filter((r) => r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q)).slice(0, 8);
  }, [query, index]);

  return (
    <div className="relative">
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses, books, articles, glossary..."
          className="w-full rounded-lg border border-border bg-panel-raised py-2.5 pl-9 pr-9 font-body text-sm text-text outline-none transition-colors focus:border-accent"
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint hover:text-text">
            <X size={14} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-panel shadow-xl"
          >
            {results.length > 0 ? (
              results.map((r) => {
                const Icon = kindIcon[r.kind];
                return (
                  <Link
                    key={`${r.kind}-${r.id}`}
                    href={r.href}
                    onClick={() => setQuery("")}
                    className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-0 hover:bg-panel-raised"
                  >
                    <Icon size={14} className="shrink-0 text-accent" />
                    <div className="min-w-0">
                      <p className="truncate font-body text-sm text-text">{r.title}</p>
                      <p className="truncate font-mono text-[10px] text-text-faint">{r.subtitle}</p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="px-4 py-4 font-body text-sm text-text-muted">No results for &quot;{query}&quot;.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
