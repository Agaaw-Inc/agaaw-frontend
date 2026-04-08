"use client";

import { useRouter } from "next/navigation";
import BlogForm from "@/components/shared/blog/BlogForm";
import { BlogFormValues } from "@/lib/validation/blogSchema";
import { MOCK_BLOGS } from "@/lib/mock/blogData";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function MentorEditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const blog = MOCK_BLOGS.find((b) => b.id === Number(id));

  const handleSubmit = (data: BlogFormValues) => {
    console.log("✅ Updated Blog (Mentor):", data);
    alert(`Blog "${data.title}" updated!`);
    router.push("/dashboard/mentor/blogs");
  };

  if (!blog) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Blog not found.</p>
        <Link href="/dashboard/mentor/blogs" className="text-teal-600 hover:underline text-sm mt-2 block">Back to Blogs</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/mentor/blogs" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={18} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Blog</h1>
          <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{blog.title}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <BlogForm
          mode="edit"
          defaultValues={{
            title: blog.title,
            content: blog.content,
            tags: blog.tags.join(", "),
            is_published: blog.is_published,
          }}
          cancelHref="/dashboard/mentor/blogs"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
