"use client";

import { useRouter } from "next/navigation";
import BlogForm from "@/components/shared/blog/BlogForm";
import { BlogFormValues } from "@/lib/validation/blogSchema";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminCreateBlogPage() {
  const router = useRouter();

  const handleSubmit = (data: BlogFormValues) => {
    console.log("✅ New Blog (Admin):", data);
    alert(`Blog "${data.title}" ${data.is_published ? "published" : "saved as draft"}!`);
    router.push("/admin/blogs");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/blogs" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={18} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Write New Blog</h1>
          <p className="text-sm text-gray-500 mt-0.5">Share insights and resources with students on the platform</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <BlogForm
          mode="create"
          cancelHref="/admin/blogs"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
