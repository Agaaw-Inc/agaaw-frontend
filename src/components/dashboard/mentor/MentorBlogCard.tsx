"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Calendar, Tag, Pencil, Trash2, ArrowRight } from "lucide-react";

export interface MentorBlogCardData {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string | null;
    coverImage?: string | null;
    category?: string | null;
    isPublished: boolean;
    createdAt: string;
    tags?: Array<{ tag: string } | string>;
}

interface MentorBlogCardProps {
    blog: MentorBlogCardData;
    onTogglePublish?: (id: string, currentStatus: boolean) => void;
    onDelete?: (blog: MentorBlogCardData) => void;
}

const DEFAULT_COVER_IMAGE =
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1000&auto=format&fit=crop";

export default function MentorBlogCard({ blog, onTogglePublish, onDelete }: MentorBlogCardProps) {
    const tagsList = Array.isArray(blog.tags)
        ? blog.tags.map((t) => (typeof t === "string" ? t : t.tag))
        : [];

    const coverUrl = blog.coverImage && blog.coverImage.startsWith("http") ? blog.coverImage : DEFAULT_COVER_IMAGE;

    return (
        <div className="border border-gray-100 rounded-xl overflow-hidden hover:border-teal-100 hover:shadow-md transition-all flex flex-col group bg-white">
            <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                <Image
                    src={coverUrl}
                    alt={blog.title || "Blog image"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={onTogglePublish ? () => onTogglePublish(blog.id, blog.isPublished) : undefined}
                        disabled={!onTogglePublish}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm backdrop-blur-md ${
                            blog.isPublished ? "bg-emerald-500/90 text-white" : "bg-amber-500/90 text-white"
                        } ${onTogglePublish ? "cursor-pointer" : "cursor-default"}`}
                    >
                        {blog.isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
                        {blog.isPublished ? "Published" : "Draft"}
                    </button>
                </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                    <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                    {blog.category && (
                        <span className="font-semibold text-teal-600 uppercase text-[10px] tracking-wider">
                            {blog.category}
                        </span>
                    )}
                </div>

                {blog.isPublished ? (
                    <Link href={`/blogs/${blog.slug}`} className="hover:text-teal-700 transition-colors">
                        <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 leading-snug">{blog.title}</h3>
                    </Link>
                ) : (
                    <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 leading-snug">{blog.title}</h3>
                )}

                <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                    {blog.excerpt || blog.content}
                </p>

                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-gray-500">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Tag size={12} />
                        {tagsList.length > 0 ? (
                            <span className="line-clamp-1 max-w-[150px]">
                                {tagsList.slice(0, 2).join(", ")}
                                {tagsList.length > 2 && ` +${tagsList.length - 2}`}
                            </span>
                        ) : (
                            "No tags"
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/dashboard/mentor/blogs/edit/${blog.id}`}
                            className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 text-xs font-bold hover:underline"
                        >
                            <Pencil size={13} /> Edit
                        </Link>
                        {onDelete && (
                            <button
                                onClick={() => onDelete(blog)}
                                className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 text-xs font-bold"
                            >
                                <Trash2 size={13} /> Delete
                            </button>
                        )}
                    </div>
                </div>

                {blog.isPublished ? (
                    <Link
                        href={`/blogs/${blog.slug}`}
                        className="mt-3 w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg border border-teal-100 text-teal-600 text-xs font-bold hover:bg-teal-50 transition-colors"
                    >
                        Read Full Article <ArrowRight size={13} />
                    </Link>
                ) : (
                    <span
                        title="Publish this blog to make it visible on the public site"
                        className="mt-3 w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-100 text-gray-400 text-xs font-bold cursor-not-allowed"
                    >
                        Publish to view live
                    </span>
                )}
            </div>
        </div>
    );
}
