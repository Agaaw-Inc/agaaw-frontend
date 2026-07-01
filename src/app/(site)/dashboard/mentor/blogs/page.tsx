"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, BookOpen, Calendar, Tag, Loader2 } from "lucide-react";
import { getMentorBlogs, updateMentorBlog, deleteMentorBlog } from "@/lib/api";

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
  useEffect(() => {
    const timer = setTimeout(onHide, 2500);
    return () => clearTimeout(timer);
  }, [onHide]);

  return (
    <div className="fixed bottom-6 right-6 z-[999] bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm">
      {message}
    </div>
  );
}

export default function MentorBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      const data = await getMentorBlogs();
      setBlogs(data);
    } catch (err) {
      console.error("Error fetching mentor blogs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await updateMentorBlog(id, { isPublished: !currentStatus });
      const data = await getMentorBlogs();
      setBlogs(data);
      setToast("Blog status updated!");
    } catch (err) {
      console.error("Failed to toggle publish status:", err);
      setToast("Failed to update status.");
    }
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        await deleteMentorBlog(deleteTarget.id);
        const data = await getMentorBlogs();
        setBlogs(data);
        setToast("Blog deleted.");
      } catch (err) {
        console.error("Failed to delete blog post:", err);
        setToast("Failed to delete blog.");
      }
      setDeleteTarget(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-2" />
        <p className="text-sm font-semibold text-gray-500">Loading your blogs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
            {blogs.map((blog) => {
              const tagsList = Array.isArray(blog.tags)
                ? blog.tags.map((t: any) => t.tag)
                : [];

              return (
                <div key={blog.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow group">
                  {/* Status & actions */}
                  <div className="flex items-start justify-between gap-3">
                    <button onClick={() => togglePublish(blog.id, blog.isPublished)} className="focus:outline-none">
                      <StatusBadge published={blog.isPublished} />
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
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-650 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <Link href={`/blogs/${blog.slug}`} className="hover:text-teal-700 transition-colors">
                    <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2">{blog.title}</h3>
                  </Link>

                  {/* Excerpt / Content */}
                  <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                    {blog.excerpt || blog.content}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-auto">
                    {/* Tags */}
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Tag size={12} />
                      {tagsList.length > 0 ? (
                        <>
                          {tagsList.slice(0, 2).join(", ")}
                          {tagsList.length > 2 && ` +${tagsList.length - 2}`}
                        </>
                      ) : (
                        "No tags"
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar size={12} />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delete confirm */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full z-10 text-center animate-in zoom-in-95">
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
    </div>
  );
}
