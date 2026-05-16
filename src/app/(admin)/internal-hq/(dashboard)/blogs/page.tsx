"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Plus, Pencil, Trash2, Eye, EyeOff, BookOpen, Search, 
  ChevronLeft, ChevronRight, Loader2, AlertCircle, CheckCircle2, XCircle,
  Filter, X
} from "lucide-react";
import * as adminApi from "@/lib/adminApi";
import type { Blog, BlogCategory, PaginatedResponse } from "@/lib/adminTypes";

/* ─── Helpers ────────────────────────────────────────────────── */
const CATEGORY_LABELS: Record<BlogCategory, string> = {
  scholarship: "Scholarships",
  visa: "Visa & Immigration",
  career: "Career Advice",
  general: "General",
  test_prep: "Test Prep",
};

function TagChip({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-teal-50 text-teal-700 font-medium border border-teal-100">
      {tag}
    </span>
  );
}

function StatusBadge({ published }: { published: boolean }) {
  return published ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
      <Eye size={10} /> Published
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-100">
      <EyeOff size={10} /> Draft
    </span>
  );
}

function Toast({ message, type, onHide }: { message: string; type: "success" | "error"; onHide: () => void }) {
  useEffect(() => { const t = setTimeout(onHide, 3000); return () => clearTimeout(t); }, [onHide]);
  return (
    <div className={`fixed bottom-6 right-6 z-[999] text-white px-5 py-3 rounded-2xl shadow-2xl text-sm flex items-center gap-2 ${type === "success" ? "bg-gray-900" : "bg-red-600"}`}>
      {type === "success" ? <CheckCircle2 size={16} className="text-teal-400" /> : <XCircle size={16} />}
      {message}
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-4"><div className="h-4 w-48 bg-gray-200 rounded mb-2" /><div className="h-3 w-32 bg-gray-100 rounded" /></td>
      <td className="px-5 py-4"><div className="h-4 w-24 bg-gray-100 rounded mb-1" /><div className="h-3 w-16 bg-gray-50 rounded" /></td>
      <td className="px-5 py-4"><div className="flex gap-1"><div className="h-5 w-12 bg-gray-100 rounded-full" /><div className="h-5 w-12 bg-gray-100 rounded-full" /></div></td>
      <td className="px-5 py-4"><div className="h-6 w-20 bg-gray-100 rounded-full" /></td>
      <td className="px-5 py-4"><div className="h-3 w-20 bg-gray-100 rounded" /></td>
      <td className="px-5 py-4 text-right"><div className="h-8 w-16 bg-gray-100 rounded-lg ml-auto" /></td>
    </tr>
  );
}

export default function AdminBlogsPage() {
  // Data state
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [category, setCategory] = useState<BlogCategory | "all">("all");
  const [isPublished, setIsPublished] = useState<"all" | "true" | "false">("all");
  const [page, setPage] = useState(1);

  // UI state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearchDebounced(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch blogs
  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await adminApi.listBlogs({
        page,
        limit: 10,
        search: searchDebounced,
        category: category === "all" ? undefined : category,
        isPublished: isPublished === "all" ? undefined : (isPublished === "true" ? true : false) as any,
      });
      setBlogs(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load blogs");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchDebounced, category, isPublished]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  /* ─── Handlers ─── */
  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteBlog(deleteId);
      setToast({ message: "Blog deleted successfully", type: "success" });
      setDeleteId(null);
      fetchBlogs();
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : "Failed to delete", type: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  const togglePublish = async (blog: Blog) => {
    try {
      await adminApi.updateBlog(blog.id, { isPublished: !blog.isPublished });
      setToast({ message: `Blog ${blog.isPublished ? "unpublished" : "published"} successfully`, type: "success" });
      fetchBlogs();
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : "Failed to update status", type: "error" });
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
          href="/internal-hq/blogs/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus size={16} />
          Write Blog
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
          <button onClick={() => fetchBlogs()} className="ml-auto underline hover:text-red-800">Retry</button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author or tag…"
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={15} className="text-gray-400" />
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value as any); setPage(1); }}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <select
            value={isPublished}
            onChange={(e) => { setIsPublished(e.target.value as any); setPage(1); }}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Status</option>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mr-1">Quick Filters:</span>
        {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
          <button
            key={value}
            onClick={() => { setCategory(category === value ? "all" : value as any); setPage(1); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border ${
              category === value
                ? "bg-teal-50 text-teal-700 border-teal-200 shadow-sm"
                : "bg-white text-gray-600 border-gray-100 hover:border-gray-300"
            }`}
          >
            {label}
            {category === value && <X size={12} className="text-teal-600" />}
          </button>
        ))}
        
        <div className="w-px h-4 bg-gray-200 mx-1" />

        <button
          onClick={() => { setIsPublished(isPublished === "true" ? "all" : "true"); setPage(1); }}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border ${
            isPublished === "true"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
              : "bg-white text-gray-600 border-gray-100 hover:border-gray-300"
          }`}
        >
          Published Only
          {isPublished === "true" && <X size={12} className="text-emerald-600" />}
        </button>

        <button
          onClick={() => { setIsPublished(isPublished === "false" ? "all" : "false"); setPage(1); }}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border ${
            isPublished === "false"
              ? "bg-amber-50 text-amber-700 border-amber-200 shadow-sm"
              : "bg-white text-gray-600 border-gray-100 hover:border-gray-300"
          }`}
        >
          Drafts Only
          {isPublished === "false" && <X size={12} className="text-amber-600" />}
        </button>

        {(search || category !== 'all' || isPublished !== 'all') && (
          <button
            onClick={() => { setSearch(''); setCategory('all'); setIsPublished('all'); setPage(1); }}
            className="ml-auto flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-500 hover:text-red-600 transition-colors"
          >
            <XCircle size={14} /> Clear All
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-left">
              <tr>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title & Content</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Author & Category</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-gray-400">
                    <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No blogs found</p>
                    <p className="text-xs mt-1">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="max-w-xs sm:max-w-md">
                        <p className="font-semibold text-gray-900 truncate">{blog.title}</p>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{blog.excerpt || blog.content.substring(0, 100).replace(/[#*]/g, '')}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-gray-700">{blog.author.firstName} {blog.author.lastName}</p>
                        <p className="text-[10px] font-semibold text-teal-600 uppercase tracking-tight mt-0.5">
                          {CATEGORY_LABELS[blog.category]}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[120px]">
                        {blog.tags.slice(0, 2).map((t) => <TagChip key={t.id} tag={t.tag} />)}
                        {blog.tags.length > 2 && (
                          <span className="text-[10px] text-gray-400 font-medium">+{blog.tags.length - 2} more</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button 
                        onClick={() => togglePublish(blog)} 
                        className="focus:outline-none hover:scale-105 transition-transform"
                        title={blog.isPublished ? "Click to unpublish" : "Click to publish"}
                      >
                        <StatusBadge published={blog.isPublished} />
                      </button>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/internal-hq/blogs/edit/${blog.id}`}
                          className="p-1.5 rounded-lg hover:bg-teal-50 text-gray-400 hover:text-teal-700 transition-all"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => { setDeleteId(blog.id); setDeleteTitle(blog.title); }}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all"
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
        </div>

        {/* Footer / Pagination */}
        {meta.totalPages > 0 && (
          <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
            <p className="text-xs text-gray-400">
              Showing <span className="font-medium text-gray-700">{blogs.length}</span> of <span className="font-medium text-gray-700">{meta.total}</span> blogs
            </p>
            {meta.totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setPage((p) => Math.max(1, p - 1))} 
                  disabled={meta.page <= 1} 
                  className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-1 px-2">
                  <span className="text-xs font-semibold text-teal-700">{meta.page}</span>
                  <span className="text-xs text-gray-400">/</span>
                  <span className="text-xs text-gray-500">{meta.totalPages}</span>
                </div>
                <button 
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} 
                  disabled={meta.page >= meta.totalPages} 
                  className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full z-10 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
              <Trash2 size={28} className="text-red-500 -rotate-3" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Blog?</h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              "<strong>{deleteTitle}</strong>" will be permanently removed. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteId(null)} 
                className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                disabled={isDeleting}
                onClick={handleDelete} 
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-2xl text-sm font-semibold hover:bg-red-700 shadow-lg shadow-red-100 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : "Delete Blog"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onHide={() => setToast(null)} />}
    </div>
  );
}
