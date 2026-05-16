"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Calendar, Tag, ArrowRight, Search, ChevronDown, Loader2, BookOpen, X, XCircle } from "lucide-react";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import Pagination from "@/components/ui/Pagination";
import * as api from "@/lib/api";
import { PublicBlog } from "@/lib/api";

const ITEMS_PER_PAGE = 6;

const CATEGORIES = [
  { value: "all", label: "All Topics" },
  { value: "scholarship", label: "Scholarships" },
  { value: "visa", label: "Visa & Immigration" },
  { value: "career", label: "Career Advice" },
  { value: "general", label: "General" },
  { value: "test_prep", label: "Test Prep" },
];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<PublicBlog[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: ITEMS_PER_PAGE, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchDebounced(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await api.getBlogs({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchDebounced,
        category: categoryFilter === "all" ? undefined : categoryFilter,
      });
      setBlogs(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load blogs");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchDebounced, categoryFilter]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <MainNavbar />
      <main className="pt-16 pb-20 bg-slate-50 min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="relative px-8 pt-10 pb-20 max-w-7xl mx-auto overflow-hidden w-full">
          <div className="relative z-10 lg:w-2/3">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
              Read Our <br />
              <span className="text-teal-600">Latest Insights</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-xl leading-relaxed mb-10 font-medium">
              Expert advice, application tips, and exclusive insights from mentors to help you navigate your study abroad journey.
            </p>
          </div>
          {/* Decorative Background Element */}
          <div className="absolute top-0 right-[-5%] w-[50%] h-full pointer-events-none hidden lg:block opacity-5">
            <BookOpen size={400} className="text-teal-600 absolute right-0 top-0 rotate-12" />
          </div>
        </section>

        {/* Filters Section */}
        <section className="px-8 mb-12 max-w-7xl mx-auto w-full">
          <div className="bg-white p-2 rounded-2xl flex flex-col md:flex-row gap-2 border border-slate-100 shadow-sm">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                className="w-full pl-12 pr-4 py-4 bg-transparent border-none rounded-xl focus:ring-2 focus:ring-teal-500/10 outline-none text-slate-900 placeholder:text-slate-400"
                placeholder="Search by topic, author, or keyword..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative min-w-[200px]">
              <select
                className="appearance-none w-full bg-slate-50 border border-slate-100 px-6 py-4 pr-12 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-teal-500/10 outline-none cursor-pointer transition-all hover:bg-slate-100"
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-slate-400" />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-8 items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pr-2">Quick Filters:</span>
            {CATEGORIES.slice(1).map((cat) => (
              <button
                key={cat.value}
                onClick={() => { setCategoryFilter(categoryFilter === cat.value ? "all" : cat.value); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 border ${categoryFilter === cat.value
                    ? "bg-teal-50 text-teal-700 border-teal-200 shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
              >
                {cat.label}
                {categoryFilter === cat.value && <X size={14} className="text-teal-600" />}
              </button>
            ))}

            {(searchQuery || categoryFilter !== 'all') && (
              <button
                onClick={() => { setSearchQuery(""); setCategoryFilter("all"); setCurrentPage(1); }}
                className="ml-auto flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-500 hover:text-red-600 transition-colors"
              >
                <XCircle size={14} /> Clear All
              </button>
            )}
          </div>
        </section>

        {/* Blog Grid */}
        <section className="px-8 max-w-7xl mx-auto w-full flex-grow">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-8 border border-slate-100 animate-pulse">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-slate-100" />
                    <div className="space-y-2">
                      <div className="h-3 w-24 bg-slate-100 rounded" />
                      <div className="h-2 w-16 bg-slate-50 rounded" />
                    </div>
                  </div>
                  <div className="h-6 w-full bg-slate-100 rounded mb-3" />
                  <div className="h-3 w-2/3 bg-slate-50 rounded mb-8" />
                  <div className="h-10 w-full bg-slate-50 rounded-xl" />
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
              <BookOpen size={64} className="mx-auto text-slate-200 mb-6" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Insights Found</h3>
              <p className="text-slate-500 max-w-xs mx-auto mb-8">We couldn't find any articles matching your current filters. Try broadening your search.</p>
              <button
                onClick={() => { setSearchQuery(""); setCategoryFilter("all"); }}
                className="text-teal-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <div key={blog.id} className="group relative bg-white border border-slate-100 rounded-[2rem] p-8 hover:shadow-2xl hover:shadow-teal-900/5 transition-all flex flex-col h-full border-b-4 border-b-transparent hover:border-b-teal-500">
                  <div className="flex items-center gap-4 mb-8">
                    {blog.author.profileImage ? (
                      <img src={blog.author.profileImage} alt="" className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 font-bold text-lg border-2 border-white shadow-sm">
                        {blog.author.firstName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-slate-900">{blog.author.firstName} {blog.author.lastName}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <span>{blog.author.role === 'admin' || blog.author.role === 'super_admin' ? 'Agaaw Team' : blog.author.role}</span>
                        <span>&middot;</span>
                        <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug">
                    <Link href={`/blogs/${blog.slug}`} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {blog.title}
                    </Link>
                  </h2>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-8 flex-grow leading-relaxed">
                    {blog.excerpt || blog.content.substring(0, 150).replace(/[#*]/g, '')}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight bg-slate-50 text-slate-500 border border-slate-100 group-hover:bg-teal-50 group-hover:text-teal-600 group-hover:border-teal-100 transition-colors">
                        {blog.category.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-teal-600 font-bold text-xs flex items-center gap-1.5 group-hover:gap-3 transition-all relative z-10">
                      READ FULL <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="mt-16">
              <Pagination
                currentPage={currentPage}
                totalPages={meta.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
