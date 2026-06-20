import Link from "next/link";
import { ArrowRight, BookOpen, PenSquare } from "lucide-react"
import { MOCK_BLOGS } from "@/lib/mock/blogData";

export default function RecentBlogs() {
    const mentorBlogs = MOCK_BLOGS.filter((b) => b.author_id === 1).slice(0, 3);
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">My Blogs</h3>
                <Link href="/dashboard/mentor/blogs" className="text-xs text-teal-600 font-medium hover:underline flex items-center gap-1">
                    View all <ArrowRight size={12} />
                </Link>
            </div>
            <div className="space-y-3">
                {mentorBlogs.length === 0 ? (
                    <div className="text-center py-8">
                        <BookOpen size={32} className="mx-auto mb-2 text-gray-200" />
                        <p className="text-sm text-gray-400">No blogs yet</p>
                        <Link href="/dashboard/mentor/blogs/create" className="text-xs text-teal-600 font-medium hover:underline block mt-1">
                            Write your first blog
                        </Link>
                    </div>
                ) : (
                    mentorBlogs.map((blog) => (
                        <div key={blog.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                            <div className="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                                <BookOpen size={16} className="text-teal-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <Link href={`/blogs/${blog.id}`} className="hover:text-teal-700 transition-colors">
                                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{blog.title}</p>
                                </Link>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className={`text-xs ${blog.is_published ? "text-emerald-600" : "text-amber-600"}`}>
                                        {blog.is_published ? "Published" : "Draft"}
                                    </span>
                                    <span className="text-gray-300">·</span>
                                    <span className="text-xs text-gray-400">{blog.created_at}</span>
                                </div>
                            </div>
                            <Link
                                href={`/dashboard/mentor/blogs/edit/${blog.id}`}
                                className="opacity-0 group-hover:opacity-100 text-xs text-teal-600 font-medium transition-opacity"
                            >
                                Edit
                            </Link>
                        </div>
                    ))
                )}
            </div>
            <Link
                href="/dashboard/mentor/blogs/create"
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-teal-200 text-teal-600 rounded-xl text-sm font-medium hover:bg-teal-50 transition-colors"
            >
                <PenSquare size={14} /> Write New Blog
            </Link>
        </div>
    );
}