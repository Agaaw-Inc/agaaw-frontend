"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogSchema, BlogFormValues } from "@/lib/validation/blogSchema";
import { Tag, Eye, EyeOff, User, Layers, FileText, Image as ImageIcon, Clock, Globe, Link as LinkIcon, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import * as adminApi from "@/lib/adminApi";
import { UserListItem } from "@/lib/adminTypes";

interface BlogFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<BlogFormValues>;
  cancelHref: string;
  onSubmit: (data: BlogFormValues) => void;
}

const CATEGORY_OPTIONS = [
  { value: "scholarship", label: "Scholarships" },
  { value: "visa", label: "Visa & Immigration" },
  { value: "career", label: "Career Advice" },
  { value: "general", label: "General" },
  { value: "test_prep", label: "Test Prep" },
];

export default function BlogForm({ mode, defaultValues, cancelHref, onSubmit }: BlogFormProps) {
  const [authors, setAuthors] = useState<UserListItem[]>([]);
  const [isLoadingAuthors, setIsLoadingAuthors] = useState(false);
  const [authorError, setAuthorError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      authorId: "",
      category: "general",
      excerpt: "",
      metaDescription: "",
      coverImage: "",
      readTime: 5,
      tags: "",
      isPublished: false,
      ...defaultValues,
    },
  });

  // Fetch authors (admins and mentors)
  useEffect(() => {
    async function fetchAuthors() {
      try {
        setIsLoadingAuthors(true);
        setAuthorError(null);
        // Fetch admins and mentors - doing two calls since backend supports one role at a time
        const [adminsRes, mentorsRes] = await Promise.all([
          adminApi.listUsers({ role: "admin", limit: 100 }),
          adminApi.listUsers({ role: "mentor", limit: 100 }),
        ]);
        
        // Combine and sort by name
        const combined = [...adminsRes.data, ...mentorsRes.data].sort((a, b) => 
          `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        );
        
        setAuthors(combined);
      } catch (err) {
        setAuthorError("Failed to load authors list");
        console.error(err);
      } finally {
        setIsLoadingAuthors(false);
      }
    }

    fetchAuthors();
  }, []);

  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,
        // Ensure nulls from backend are converted to empty strings for form fields
        excerpt: defaultValues.excerpt || "",
        metaDescription: defaultValues.metaDescription || "",
        coverImage: defaultValues.coverImage || "",
      });
    }
  }, [defaultValues, reset]);

  const isPublished = watch("isPublished");
  const title = watch("title");

  // Auto-generate slug from title if in create mode and slug is empty
  useEffect(() => {
    if (mode === "create" && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [mode, title, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto">
      {/* ── Main Content Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Core Data */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Blog Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title")}
              placeholder="e.g. How to Write a Winning Scholarship Essay"
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} /> {errors.title.message}</p>}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register("slug")}
                placeholder="how-to-write-winning-essay"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
            {errors.slug && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} /> {errors.slug.message}</p>}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <textarea
                {...register("content")}
                rows={18}
                placeholder="Write your blog content here. Markdown is supported..."
                className="w-full px-4 py-4 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-y leading-relaxed font-normal"
              />
              <div className="absolute right-3 bottom-3 text-[10px] text-gray-400 bg-white/80 px-2 py-1 rounded-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                Supports Markdown
              </div>
            </div>
            {errors.content && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={12} /> {errors.content.message}</p>}
          </div>
        </div>

        {/* Right Column: Metadata & Settings */}
        <div className="space-y-6">
          {/* Author Selection */}
          <div className="bg-gray-50/50 p-5 rounded-3xl border border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <User size={16} className="text-teal-600" /> Authorship
            </h3>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Select Author</label>
              {isLoadingAuthors ? (
                <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
                  <Loader2 size={14} className="animate-spin" /> Loading authors...
                </div>
              ) : authorError ? (
                <p className="text-xs text-red-500">{authorError}</p>
              ) : (
                <select
                  {...register("authorId")}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="">Select an author...</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.firstName} {author.lastName} ({author.role})
                    </option>
                  ))}
                </select>
              )}
              {errors.authorId && <p className="text-red-500 text-[10px] mt-1">{errors.authorId.message}</p>}
            </div>
          </div>

          {/* Taxonomy & Meta */}
          <div className="bg-gray-50/50 p-5 rounded-3xl border border-gray-100 space-y-5">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Layers size={16} className="text-teal-600" /> Taxonomy & SEO
            </h3>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Category</label>
              <select
                {...register("category")}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Tags (comma-separated)</label>
              <div className="relative">
                <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register("tags")}
                  placeholder="scholarship, tips, career"
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Excerpt</label>
              <textarea
                {...register("excerpt")}
                rows={3}
                placeholder="Brief summary for list views..."
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Meta Description (SEO)</label>
              <textarea
                {...register("metaDescription")}
                rows={3}
                placeholder="Google search snippet description (max 160 chars)..."
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
              {errors.metaDescription && <p className="text-red-500 text-[10px] mt-1">{errors.metaDescription.message}</p>}
            </div>
          </div>

          {/* Media & Details */}
          <div className="bg-gray-50/50 p-5 rounded-3xl border border-gray-100 space-y-5">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <FileText size={16} className="text-teal-600" /> Visuals & Info
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Cover Image URL</label>
              <div className="relative">
                <ImageIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register("coverImage")}
                  placeholder="https://... or /images/..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Estimated Read Time (min)</label>
              <div className="relative">
                <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  {...register("readTime", { valueAsNumber: true })}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Publish status */}
          <div className="flex items-center justify-between p-5 bg-teal-50/50 rounded-3xl border border-teal-100/50">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPublished ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
                {isPublished ? <Eye size={20} /> : <EyeOff size={20} />}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{isPublished ? "Published" : "Draft"}</p>
                <p className="text-[10px] text-gray-500 font-medium">{isPublished ? "Live on site" : "Hidden from site"}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer scale-110">
              <input type="checkbox" {...register("isPublished")} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600 shadow-inner" />
            </label>
          </div>
        </div>
      </div>

      {/* ── Footer Actions ── */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
        <Link
          href={cancelHref}
          className="px-8 py-3 border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors text-sm font-semibold"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-10 py-3 bg-teal-700 text-white rounded-2xl hover:bg-teal-800 transition-all text-sm font-bold disabled:opacity-60 shadow-lg shadow-teal-100 flex items-center gap-2"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {mode === "create" ? "Create Blog Post" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
