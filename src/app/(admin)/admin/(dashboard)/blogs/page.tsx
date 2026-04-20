"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MOCK_BLOGS, Blog } from "@/lib/mock/blogData";
import { Plus, Pencil, Trash2, Eye, EyeOff, BookOpen, Search } from "lucide-react";

function TagChip({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-teal-50 text-teal-700 font-medium">
      {tag}
    </span>
  );
}

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

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>(MOCK_BLOGS);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return !q ? blogs : blogs.filter(
      (b) => b.title.toLowerCase().includes(q) || b.author_name.toLowerCase().includes(q) || b.tags.some(t => t.includes(q))
    );
  }, [blogs, search]);

  const togglePublish = (id: number) => {
    setBlogs((prev) => prev.map((b) => b.id === id ? { ...b, is_published: !b.is_published } : b));
    setToast("Blog status updated!");
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setBlogs((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setToast(`"${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blogs & Resources</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage all blog posts written by mentors and admins</p>
        </div>
        <Link
          href="/admin/blogs/create"
          id="write-blog-btn"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus size={16} />
          Write Blog
        </Link>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="relative max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author or tag…"
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-gray-400">
                  <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No blogs found</p>
                </td>
              </tr>
            ) : (
              filtered.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50/60 transition-colors group">
                  <td className="px-5 py-4">
                    <Link href={`/blogs/${blog.id}`} className="hover:text-teal-700 transition-colors">
                      <p className="font-medium text-gray-900 line-clamp-1 max-w-xs">{blog.title}</p>
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-xs">{blog.content.substring(0, 80)}…</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-gray-700 font-medium">{blog.author_name}</p>
                    <span className={`text-xs ${blog.author_role === "admin" ? "text-violet-600" : "text-teal-600"}`}>
                      {blog.author_role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {blog.tags.slice(0, 2).map((t) => <TagChip key={t} tag={t} />)}
                      {blog.tags.length > 2 && <span className="text-xs text-gray-400">+{blog.tags.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => togglePublish(blog.id)} className="focus:outline-none">
                      <StatusBadge published={blog.is_published} />
                    </button>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{blog.created_at}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/blogs/edit/${blog.id}`}
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-50">
            <p className="text-xs text-gray-400">Showing {filtered.length} of {blogs.length} blogs</p>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full z-10 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Blog?</h3>
            <p className="text-sm text-gray-500 mb-6">
              "<strong>{deleteTarget.title}</strong>" will be permanently removed.
            </p>
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
