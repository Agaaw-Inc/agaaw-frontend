"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import BlogForm from "@/components/shared/blog/BlogForm";
import { BlogFormValues } from "@/lib/validation/blogSchema";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import * as adminApi from "@/lib/adminApi";
import { Blog } from "@/lib/adminTypes";

/* ─── Toast ──────────────────────────────────────────────────── */
function Toast({ message, type, onHide }: { message: string; type: "success" | "error"; onHide: () => void }) {
  useState(() => { const t = setTimeout(onHide, 3000); return () => clearTimeout(t); });
  return (
    <div className={`fixed bottom-6 right-6 z-[999] text-white px-5 py-3 rounded-2xl shadow-2xl text-sm flex items-center gap-2 animate-in slide-in-from-right-5 ${type === "success" ? "bg-gray-900" : "bg-red-600"}`}>
      {type === "success" ? <CheckCircle2 size={16} className="text-teal-400" /> : <XCircle size={16} />}
      {message}
    </div>
  );
}

export default function AdminEditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function fetchBlog() {
      try {
        setIsLoading(true);
        const data = await adminApi.getBlog(id);
        setBlog(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load blog");
      } finally {
        setIsLoading(false);
      }
    }
    fetchBlog();
  }, [id]);

  const handleSubmit = async (data: BlogFormValues) => {
    try {
      const tagsArray = data.tags 
        ? data.tags.split(",").map(t => t.trim()).filter(t => t.length > 0)
        : [];

      await adminApi.updateBlog(id, {
        ...data,
        tags: tagsArray,
        excerpt: data.excerpt || null as any,
        metaDescription: data.metaDescription || null as any,
        coverImage: data.coverImage || null as any,
        readTime: data.readTime || null as any,
      });

      setToast({ message: "Blog post updated successfully!", type: "success" });
      
      setTimeout(() => {
        router.push("/internal-hq/blogs");
      }, 1500);
    } catch (err) {
      setToast({ 
        message: err instanceof Error ? err.message : "Failed to update blog post", 
        type: "error" 
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 size={40} className="text-teal-600 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Loading blog content...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-md mx-auto text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm mt-10 p-10">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Blog</h2>
        <p className="text-sm text-gray-500 mb-8">{error || "The blog you are looking for does not exist."}</p>
        <Link href="/internal-hq/blogs" className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-colors text-sm font-medium">
          <ArrowLeft size={16} />
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/internal-hq/blogs" 
          className="p-3 rounded-2xl bg-white border border-gray-100 shadow-sm hover:bg-gray-50 transition-all text-gray-600 hover:text-teal-700"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Blog</h1>
          <p className="text-sm text-gray-500 mt-0.5 font-medium line-clamp-1">Refining: {blog.title}</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 lg:p-12">
        <BlogForm
          mode="edit"
          defaultValues={{
            title: blog.title,
            slug: blog.slug,
            content: blog.content,
            authorId: blog.authorId,
            category: blog.category,
            excerpt: blog.excerpt,
            metaDescription: blog.metaDescription,
            coverImage: blog.coverImage,
            readTime: blog.readTime,
            tags: blog.tags.map(t => t.tag).join(", "),
            isPublished: blog.isPublished,
          }}
          cancelHref="/internal-hq/blogs"
          onSubmit={handleSubmit}
        />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onHide={() => setToast(null)} />}
    </div>
  );
}
