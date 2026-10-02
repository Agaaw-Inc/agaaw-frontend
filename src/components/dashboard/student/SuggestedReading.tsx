"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { PublicBlog } from "@/lib/api";
import type { Category } from "@/lib/categories";

/**
 * Which blog categories serve which mentorship category. Blog posts still
 * use the older study-abroad tags; "general" fits every area.
 */
const BLOG_TAGS_FOR: Record<string, PublicBlog["category"][]> = {
  "study-abroad": ["scholarship", "visa", "test_prep"],
  career: ["career"],
  business: ["general"],
  "research-publication": ["general"],
};

const LABEL: Record<PublicBlog["category"], string> = {
  scholarship: "Scholarships",
  visa: "Visa",
  career: "Career",
  general: "General",
  test_prep: "Test prep",
};

const SHOW = 3;
const FALLBACK_COVER = "/images/blog-agaaw.png";

export default function SuggestedReading({
  blogs,
  myCategories,
  isLoading,
}: {
  blogs: PublicBlog[];
  myCategories: Category[];
  isLoading: boolean;
}) {
  const picks = useMemo(() => {
    const wanted = new Set(
      myCategories.flatMap((c) => BLOG_TAGS_FOR[c.slug] ?? ["general"]),
    );
    const matched = blogs.filter((b) => wanted.has(b.category));
    // Too few matches? Top up with the newest posts so the row isn't empty.
    const rest = blogs.filter((b) => !wanted.has(b.category));
    return [...matched, ...rest].slice(0, SHOW);
  }, [blogs, myCategories]);

  return (
    <section>
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-display text-2xl font-extrabold tracking-[-0.02em] text-ink">
          Worth reading
        </h2>
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1 text-sm font-semibold text-ink hover:underline"
        >
          All articles <ArrowRight size={15} />
        </Link>
      </div>

      {!isLoading && picks.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-ink/15 px-6 py-10 text-center">
          <p className="font-display text-lg font-bold text-ink">
            No articles in your areas yet
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Mentors are writing guides — new ones appear here first.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-2xl bg-paper-deep"
                />
              ))
            : picks.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-ink/10 transition-shadow hover:shadow-[0_10px_30px_-12px_rgba(20,24,22,0.25)]"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-paper-deep">
                    {/* eslint-disable-next-line @next/next/no-img-element -- covers are admin-entered URLs on several hosts */}
                    <img
                      src={blog.coverImage || FALLBACK_COVER}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-elm">
                      {LABEL[blog.category]}
                    </p>
                    <h3 className="mt-1 line-clamp-2 font-display text-lg font-bold leading-snug text-ink group-hover:underline">
                      {blog.title}
                    </h3>
                    {blog.excerpt && (
                      <p className="mt-2 line-clamp-2 text-sm text-ink-soft">
                        {blog.excerpt}
                      </p>
                    )}
                    <p className="mt-auto flex items-center gap-1.5 pt-3 text-xs text-ink-soft">
                      {blog.author.firstName} {blog.author.lastName}
                      {blog.readTime ? (
                        <>
                          {" "}
                          · <Clock size={12} /> {blog.readTime} min
                        </>
                      ) : null}
                    </p>
                  </div>
                </Link>
              ))}
        </div>
      )}
    </section>
  );
}
