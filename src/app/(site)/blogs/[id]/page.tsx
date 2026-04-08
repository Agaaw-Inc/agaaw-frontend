import { notFound } from "next/navigation";
import Link from "next/link";
import { MOCK_BLOGS } from "@/lib/mock/blogData";
import { Calendar, Tag, ArrowLeft, Share2 } from "lucide-react";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";

export default async function SingleBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = MOCK_BLOGS.find((b) => b.id === Number(id));

  // If blog is not found, or it's not published (unless we want authors to preview), return 404
  if (!blog) {
    notFound();
  }

  return (
    <>
      <MainNavbar />
      <article className="min-h-screen bg-gray-50/50 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft size={16} /> Back to Blogs
          </Link>

          <header className="mb-10 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              {blog.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700">
                  <Tag size={12} /> {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                  {blog.author_name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="text-base font-semibold text-gray-900">{blog.author_name}</p>
                  <p className="text-sm text-teal-600 font-medium capitalize">{blog.author_role}</p>
                </div>
              </div>
              <div className="h-10 w-px bg-gray-200"></div>
              <div className="text-left text-gray-500">
                <p className="text-xs uppercase tracking-wider font-semibold mb-1">Published</p>
                <p className="text-sm flex items-center gap-1.5 font-medium"><Calendar size={14} /> {blog.created_at}</p>
              </div>
            </div>
          </header>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 mb-12">
            <div className="prose prose-lg prose-teal max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
              {blog.content}
            </div>
          </div>

          <div className="flex items-center justify-between py-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-500">Liked this article?</p>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors text-gray-700">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      </article>
      <Footer />
    </>
  );
}
