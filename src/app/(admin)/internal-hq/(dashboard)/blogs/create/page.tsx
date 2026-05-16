"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BlogForm from "@/components/shared/blog/BlogForm";
import { BlogFormValues } from "@/lib/validation/blogSchema";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import * as adminApi from "@/lib/adminApi";

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

export default function AdminCreateBlogPage() {
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (data: BlogFormValues) => {
    try {
      // Process tags: split by comma, trim, filter empty
      const tagsArray = data.tags 
        ? data.tags.split(",").map(t => t.trim()).filter(t => t.length > 0)
        : [];

      await adminApi.createBlog({
        ...data,
        tags: tagsArray,
        excerpt: data.excerpt || undefined,
        metaDescription: data.metaDescription || undefined,
        coverImage: data.coverImage || undefined,
        readTime: data.readTime || undefined,
      });

      setToast({ message: "Blog post created successfully!", type: "success" });
      
      // Delay redirect to show toast
      setTimeout(() => {
        router.push("/internal-hq/blogs");
      }, 1500);
    } catch (err) {
      setToast({ 
        message: err instanceof Error ? err.message : "Failed to create blog post", 
        type: "error" 
      });
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Write New Blog</h1>
          <p className="text-sm text-gray-500 mt-0.5 font-medium">Share insights and resources with students on the platform</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 lg:p-12">
        <BlogForm
          mode="create"
          cancelHref="/internal-hq/blogs"
          onSubmit={handleSubmit}
        />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onHide={() => setToast(null)} />}
    </div>
  );
}
