"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogSchema, BlogFormValues } from "@/lib/validation/blogSchema";
import { Tag, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface BlogFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<BlogFormValues>;
  cancelHref: string;
  onSubmit: (data: BlogFormValues) => void;
}

export default function BlogForm({ mode, defaultValues, cancelHref, onSubmit }: BlogFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
      is_published: false,
      ...defaultValues,
    },
  });

  useEffect(() => {
    reset({ title: "", content: "", tags: "", is_published: false, ...defaultValues });
  }, [defaultValues, reset]);

  const isPublished = watch("is_published");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Blog Title <span className="text-red-500">*</span>
        </label>
        <input
          {...register("title")}
          placeholder="e.g. How to Write a Winning Scholarship Essay"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-base"
        />
        {errors.title && <p className="text-red-500 text-xs mt-1.5">{errors.title.message}</p>}
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("content")}
          rows={16}
          placeholder="Write your blog content here. Share insights, tips, and valuable information for students..."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-y leading-relaxed"
        />
        {errors.content && <p className="text-red-500 text-xs mt-1.5">{errors.content.message}</p>}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <span className="flex items-center gap-1.5">
            <Tag size={14} /> Tags
            <span className="text-gray-400 font-normal">(comma-separated)</span>
          </span>
        </label>
        <input
          {...register("tags")}
          placeholder="e.g. scholarship, essay, tips"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Publish toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
        <div className="flex items-center gap-3">
          {isPublished ? (
            <Eye size={18} className="text-teal-600" />
          ) : (
            <EyeOff size={18} className="text-gray-400" />
          )}
          <div>
            <p className="text-sm font-medium text-gray-700">
              {isPublished ? "Published" : "Draft"}
            </p>
            <p className="text-xs text-gray-400">
              {isPublished
                ? "This blog is visible to all students"
                : "Save as draft — not visible to students yet"}
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" {...register("is_published")} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600" />
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Link
          href={cancelHref}
          className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-teal-700 text-white rounded-xl hover:bg-teal-800 transition-colors text-sm font-medium disabled:opacity-60"
        >
          {mode === "create" ? "Publish Blog" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
