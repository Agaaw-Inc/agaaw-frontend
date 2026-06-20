"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MOCK_BLOGS, Blog } from "@/lib/mock/blogData";
import { Plus, Pencil, Trash2, Eye, EyeOff, BookOpen, Calendar, Tag } from "lucide-react";

/* Filter by this mentor's author_id (mock: 1 = Arif Rahman) */
const MENTOR_ID = 1;

function StatusBadge({ published }: { published: boolean }) {
  return published ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
      <Eye size={11} /> Published
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
      <EyeOff size={11} /> Draft
    </span>
  );
}

function Toast({ message, onHide }: { message: string; onHide: () => void }) {
  setTimeout(onHide, 2500);
  return (
    <div className="fixed bottom-6 right-6 z-[999] bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm">
      {message}
    </div>
  );
}

export default function MentorBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>(
    MOCK_BLOGS.filter((b) => b.author_id === MENTOR_ID)
  );
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const togglePublish = (id: number) => {
    setBlogs((prev) => prev.map((b) => b.id === id ? { ...b, is_published: !b.is_published } : b));
    setToast("Blog status updated!");
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setBlogs((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setToast("Blog deleted.");
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Blogs</h1>
          <p className="text-sm text-gray-500 mt-0.5">Share knowledge with students through your blog posts</p>
        </div>
        <Link
          href="/dashboard/mentor/blogs/create"
          id="write-blog-btn"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus size={16} />
          Write New Blog
        </Link>
      </div>

      {/* Blog cards grid */}
      {blogs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-200" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No blogs yet</h3>
          <p className="text-sm text-gray-400 mb-6">Start sharing your knowledge with students on the platform.</p>
          <Link
            href="/dashboard/mentor/blogs/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-colors text-sm font-medium"
          >
            <Plus size={16} /> Write Your First Blog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow group">
              {/* Status & actions */}
              <div className="flex items-start justify-between gap-3">
                <button onClick={() => togglePublish(blog.id)} className="focus:outline-none">
                  <StatusBadge published={blog.is_published} />
                </button>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/dashboard/mentor/blogs/edit/${blog.id}`}
                    className="p-2 rounded-lg hover:bg-teal-50 text-gray-400 hover:text-teal-700 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(blog)}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Title */}
              <Link href={`/blogs/${blog.id}`} className="hover:text-teal-700 transition-colors">
                <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2">{blog.title}</h3>
              </Link>

              {/* Excerpt */}
              <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{blog.content}</p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-auto">
                {/* Tags */}
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Tag size={12} />
                  {blog.tags.slice(0, 2).join(", ")}
                  {blog.tags.length > 2 && ` +${blog.tags.length - 2}`}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar size={12} />
                  {blog.created_at}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full z-10 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Blog?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onHide={() => setToast(null)} />}
    </div>
  );
}
