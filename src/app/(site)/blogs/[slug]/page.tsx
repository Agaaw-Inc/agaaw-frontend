import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Tag, ChevronRight, User, Clock, Share2, BookOpen, Layers } from "lucide-react";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import * as api from "@/lib/api";

export default async function SingleBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let blog = null;
  try {
    blog = await api.getBlogBySlug(slug);
  } catch (err) {
    console.error("Failed to fetch blog:", err);
  }

  // If blog is not found, return 404
  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <MainNavbar />
      
      {/* Hero Section */}
      <div className="bg-slate-900 border-b border-slate-800 text-white pt-32 pb-32 px-6 relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <BookOpen size={400} className="absolute -right-20 -top-20 rotate-12" />
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
              <Link href="/blogs" className="inline-flex items-center text-slate-400 hover:text-white mb-12 transition-all text-xs font-bold uppercase tracking-widest group">
                  <ChevronRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  Back to Insights
              </Link>
              
              <div className="flex flex-col gap-8 items-start">
                  <div className="max-w-4xl">
                      <span className="inline-block px-4 py-1.5 bg-teal-600 text-white rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase mb-8 shadow-lg shadow-teal-900/20">
                          {blog.category.replace('_', ' ')}
                      </span>
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 text-white leading-[1.1]">
                          {blog.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-6 text-slate-400">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-teal-500 font-bold text-xs border border-slate-700">
                            {blog.author.firstName.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-slate-200">{blog.author.firstName} {blog.author.lastName}</span>
                        </div>
                        <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Calendar size={14} className="text-teal-500" />
                          {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Clock size={14} className="text-teal-500" />
                          {blog.readTime || 5} min read
                        </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-20 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 items-start">
              
              {/* Left Column (Article) */}
              <div className="lg:col-span-3 space-y-12">
                  {blog.coverImage && (
                    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100">
                      <img src={blog.coverImage} alt={blog.title} className="w-full h-auto object-cover max-h-[500px]" />
                    </div>
                  )}

                  <article className="prose prose-xl prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-teal-600 prose-img:rounded-3xl prose-pre:bg-slate-900 prose-pre:rounded-2xl prose-strong:text-slate-900 text-slate-600 leading-[1.8] font-medium whitespace-pre-wrap">
                      {blog.content}
                  </article>

                  <div className="pt-12 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Tag size={14} /> Article Tags
                      </h4>
                      <div className="flex gap-2 flex-wrap">
                          {blog.tags.map((t) => (
                              <span key={t.id} className="inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100 transition-colors cursor-default">
                                  #{t.tag}
                              </span>
                          ))}
                      </div>
                  </div>
              </div>

              {/* Right Column (Sidebar) */}
              <div className="lg:col-span-1 space-y-10 sticky top-32">
                  {/* Author Card */}
                  <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 transition-all hover:shadow-xl hover:shadow-slate-200/50">
                      <div className="relative mb-6">
                        {blog.author.profileImage ? (
                          <img src={blog.author.profileImage} alt="" className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md" />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-md">
                            {blog.author.firstName.charAt(0)}
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg mb-1">{blog.author.firstName} {blog.author.lastName}</h3>
                      <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-6">
                        {blog.author.role === 'admin' || blog.author.role === 'super_admin' ? 'Agaaw Team' : blog.author.role}
                      </p>
                      
                      <div className="space-y-4">
                        <button className="w-full py-3 px-4 bg-white hover:bg-slate-900 hover:text-white rounded-2xl text-slate-600 font-bold text-xs transition-all border border-slate-200 flex items-center justify-center gap-2 group">
                          <User size={14} className="group-hover:scale-110 transition-transform" /> VIEW PROFILE
                        </button>
                        <button className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold text-xs transition-all shadow-lg shadow-teal-100 flex items-center justify-center gap-2 group">
                          <Share2 size={14} className="group-hover:rotate-12 transition-transform" /> SHARE INSIGHT
                        </button>
                      </div>
                  </div>

                  {/* Related Info */}
                  <div className="px-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Reading Tip</h4>
                    <p className="text-xs text-slate-500 leading-relaxed italic">
                      "Insights are more valuable when shared. Consider discussing this with your mentor or peers."
                    </p>
                  </div>
              </div>
              
          </div>
      </main>

      <Footer />
    </div>
  );
}
