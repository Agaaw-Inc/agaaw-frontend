"use client";

import Link from "next/link";
import { BookOpen, ArrowRight, PenSquare, Calendar } from "lucide-react";
import type { Blog } from "@/lib/mock/blogData";

interface BlogPostsSectionProps {
  blogIds: number[];
  isOwner: boolean;
}

export default function BlogPostsSection({ blogIds, isOwner }: BlogPostsSectionProps) {
  const blogs = getMentorBlogs(blogIds);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Blog Posts</h2>
        {isOwner && (
          <Link
            href="/dashboard/mentor/blogs/create"
            className="flex items-center gap-1.5 text-xs text-teal-600 font-medium hover:text-teal-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-teal-50"
          >
            <PenSquare size={13} />
            Write Blog
          </Link>
        )}
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-10">
          <BookOpen size={36} className="mx-auto mb-3 text-gray-200" />
          <p className="text-sm text-gray-400 mb-1">No blog posts yet</p>
          {isOwner && (
            <Link
              href="/dashboard/mentor/blogs/create"
              className="text-xs text-teal-600 font-medium hover:underline"
            >
              Write your first blog post
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {blogs.map((blog: Blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.id}`}
              className="block p-4 rounded-xl border border-gray-50 hover:border-teal-100 hover:bg-teal-50/30 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                  <BookOpen size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {blog.content.slice(0, 120)}...
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={11} />
                      {blog.created_at}
                    </span>
                    <div className="flex gap-1">
                      {blog.tags.slice(0, 2).map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="text-gray-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all mt-2 shrink-0"
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
