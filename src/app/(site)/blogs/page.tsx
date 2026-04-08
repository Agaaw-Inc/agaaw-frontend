import Link from "next/link";
import { MOCK_BLOGS } from "@/lib/mock/blogData";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";

export default function BlogsPage() {
  const publishedBlogs = MOCK_BLOGS.filter((b) => b.is_published);

  return (
    <>
      <MainNavbar />
      <div className="min-h-screen bg-gray-50/50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Blogs &amp; Resources</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Advice, tips, and insights from mentors to help you secure your dream scholarship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {publishedBlogs.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-500">
                No published blogs found.
              </div>
            ) : (
              publishedBlogs.map((blog) => (
                <div key={blog.id} className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-all flex flex-col group h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                      {blog.author_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{blog.author_name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="capitalize">{blog.author_role}</span>
                        <span>&middot;</span>
                        <span className="flex items-center gap-1"><Calendar size={10} /> {blog.created_at}</span>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-700 transition-colors line-clamp-2">
                    <Link href={`/blogs/${blog.id}`} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {blog.title}
                    </Link>
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-8 flex-grow">
                    {blog.content}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          <Tag size={10} /> {tag}
                        </span>
                      ))}
                      {blog.tags.length > 2 && (
                        <span className="text-xs text-gray-400 font-medium px-1">+{blog.tags.length - 2}</span>
                      )}
                    </div>
                    <span className="text-teal-600 font-medium text-sm flex items-center gap-1 hover:text-teal-800 transition-colors relative z-10">
                      Read more <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
