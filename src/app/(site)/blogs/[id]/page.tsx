import { notFound } from "next/navigation";
import Link from "next/link";
import { MOCK_BLOGS } from "@/lib/mock/blogData";
import { Calendar, Tag, ChevronRight, User, Clock, Share2 } from "lucide-react";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";

export default async function SingleBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = MOCK_BLOGS.find((b) => b.id === Number(id));

  // If blog is not found, return 404
  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <MainNavbar />
      
      {/* Hero Section */}
      <div className="bg-teal-900 border-b border-teal-800 text-white pt-20 pb-24 px-6">
          <div className="max-w-5xl mx-auto">
              <Link href="/blogs" className="inline-flex items-center text-teal-200 hover:text-white mb-8 transition-colors text-sm font-medium">
                  <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
                  Back to Blogs
              </Link>
              
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start justify-between">
                  <div className="flex-1">
                      <span className="inline-block px-4 py-1.5 bg-teal-800/50 text-teal-100 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-teal-700/50">
                          {blog.tags[0] || "Article"}
                      </span>
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white min-h-[4rem]">
                          {blog.title}
                      </h1>
                      <p className="text-lg md:text-xl text-teal-50 max-w-2xl leading-relaxed font-light line-clamp-3">
                          {blog.content.substring(0, 180)}...
                      </p>
                  </div>
                  
                  {/* Meta Info Box */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 w-full md:w-auto md:min-w-[300px] shrink-0 mt-4 md:mt-0 shadow-xl shadow-teal-950/20">
                      <h3 className="text-xs font-bold text-teal-200 uppercase tracking-widest mb-5">Quick Details</h3>
                      <ul className="space-y-5">
                          <li className="flex items-center gap-4">
                              <div className="bg-white/10 p-2.5 rounded-xl"><User className="w-5 h-5 text-teal-200" /></div>
                              <div>
                                  <p className="text-[11px] font-semibold tracking-wider text-teal-300 uppercase mb-0.5">Author</p>
                                  <p className="font-medium text-white">{blog.author_name}</p>
                              </div>
                          </li>
                          <li className="flex items-center gap-4">
                              <div className="bg-white/10 p-2.5 rounded-xl"><Calendar className="w-5 h-5 text-teal-200" /></div>
                              <div>
                                  <p className="text-[11px] font-semibold tracking-wider text-teal-300 uppercase mb-0.5">Published</p>
                                  <p className="font-medium text-white">{blog.created_at}</p>
                              </div>
                          </li>
                          <li className="flex items-center gap-4">
                              <div className="bg-white/10 p-2.5 rounded-xl"><Clock className="w-5 h-5 text-teal-200" /></div>
                              <div>
                                  <p className="text-[11px] font-semibold tracking-wider text-teal-300 uppercase mb-0.5">Read Time</p>
                                  <p className="font-medium text-white">5 min read</p>
                              </div>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 -mt-10 mb-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column (Details) */}
              <div className="lg:col-span-2 space-y-8">
                  <section className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                      <div className="prose prose-lg prose-teal max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {blog.content}
                      </div>

                      <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
                          <div className="flex gap-2 flex-wrap">
                              {blog.tags.map((tag) => (
                                  <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-100">
                                      <Tag size={12} /> {tag}
                                  </span>
                              ))}
                          </div>
                      </div>
                  </section>
              </div>

              {/* Right Column (Sidebar) */}
              <div className="lg:col-span-1 space-y-6">
                  {/* Share Card */}
                  <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 sticky top-24">
                      <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold mb-4 text-lg">
                        {blog.author_name.charAt(0)}
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg mb-1">{blog.author_name}</h3>
                      <p className="text-sm font-medium text-teal-600 capitalize mb-4">{blog.author_role}</p>
                      
                      <div className="h-px bg-slate-100 w-full mb-6"></div>

                      <h4 className="font-bold text-slate-800 mb-2 text-sm">Share this article</h4>
                      <p className="text-xs text-slate-500 mb-4">Found this helpful? Share it with your network.</p>
                      <div className="flex gap-2">
                          <button className="flex-1 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100 flex justify-center items-center transition-colors">
                              <Share2 className="w-4 h-4 mr-2" /> Share
                          </button>
                      </div>
                  </div>
              </div>
              
          </div>
      </main>

      <Footer />
    </div>
  );
}
