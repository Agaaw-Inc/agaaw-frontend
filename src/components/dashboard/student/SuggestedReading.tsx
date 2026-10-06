"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import type { PublicBlog } from "@/lib/api";
import SectionHeading from "@/components/ui/SectionHeading";
import ArrowLink from "@/components/ui/ArrowLink";
import EmptyState from "@/components/ui/EmptyState";
import { cardClasses } from "@/components/ui/Card";

/** Posts about the application itself come first. */
const STUDY_ABROAD_TAGS = new Set<PublicBlog["category"]>(["scholarship", "visa", "test_prep"]);

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
  isLoading,
}: {
  blogs: PublicBlog[];
  isLoading: boolean;
}) {
  const picks = useMemo(() => {
    const matched = blogs.filter((b) => STUDY_ABROAD_TAGS.has(b.category));
    // Too few matches? Top up with the newest posts so the row isn't empty.
    const rest = blogs.filter((b) => !STUDY_ABROAD_TAGS.has(b.category));
    return [...matched, ...rest].slice(0, SHOW);
  }, [blogs]);

  return (
    <section>
      <SectionHeading
        size="card"
        title="Worth reading"
        action={<ArrowLink href="/blogs">All articles</ArrowLink>}
        className="mb-4"
      />

      {!isLoading && picks.length === 0 ? (
        <EmptyState
          title="No articles in your areas yet"
          body="Mentors are writing guides — new ones appear here first."
        />
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
                  className={cardClasses({ padding: "none", interactive: true, className: "group flex flex-col overflow-hidden" })}
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
                    <h3 className="mt-1 line-clamp-2 text-lg font-bold leading-snug text-ink group-hover:underline">
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
