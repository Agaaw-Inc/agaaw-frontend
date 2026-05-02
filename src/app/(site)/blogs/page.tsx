"use client";

import Link from "next/link";
import { MOCK_BLOGS } from "@/lib/mock/blogData";
import { Calendar, Tag, ArrowRight, Search, ChevronDown } from "lucide-react";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import { useState, useMemo } from "react";
import Pagination from "@/components/ui/Pagination";

const ITEMS_PER_PAGE = 2;

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("Topic");
  const [authorFilter, setAuthorFilter] = useState("Author");
  const [currentPage, setCurrentPage] = useState(1);

  const publishedBlogs = useMemo(() => MOCK_BLOGS.filter((b) => b.is_published), []);

  const filteredBlogs = useMemo(() => {
    return publishedBlogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.author_name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTopic =
        topicFilter === "Topic" ||
        blog.tags.some(tag => {
          if (topicFilter === "Scholarships") return tag.toLowerCase().includes("scholarship");
          if (topicFilter === "Application Tips") return tag.toLowerCase().includes("tips");
          if (topicFilter === "Student Life") return tag.toLowerCase().includes("mentorship") || tag.toLowerCase().includes("communication");
          return false;
        });

      const matchesAuthor =
        authorFilter === "Author" ||
        (authorFilter === "Mentors" && blog.author_role === "mentor") ||
        (authorFilter === "Students" && blog.author_role === "student") ||
        (authorFilter === "Advisors" && blog.author_role === "admin");

      return matchesSearch && matchesTopic && matchesAuthor;
    });
  }, [publishedBlogs, searchQuery, topicFilter, authorFilter]);

  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
  const currentBlogs = filteredBlogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
            <span className="inline-block px-3 py-1 mb-6 text-xs font-medium tracking-widest uppercase rounded-full bg-elm/10 text-elm">
              Insights &amp; Guides
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-codgray mb-6 leading-[1.1]">
              Read Our <br />
              <span className="text-elm">Latest Insights</span>
            </h1>
            <p className="text-lg md:text-xl text-bombay max-w-xl leading-relaxed mb-10">
              Expert advice, application tips, and exclusive insights from mentors to help you navigate your study abroad journey.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 rounded-lg font-bold text-codgray hover:bg-slate-200 transition-colors">
                Write for Us
              </button>
            </div>
          </div>
          {/* Decorative Background Element */}
          <div className="absolute top-0 right-[-5%] w-[50%] h-full pointer-events-none hidden lg:block opacity-15">
            <div
              className="w-full h-full bg-[#20B2AA]"
              style={{
                maskImage: "url('/blog-bg.svg')",
                WebkitMaskImage: "url('/blog-bg.svg')",
                maskSize: "contain",
                WebkitMaskSize: "contain",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "center right",
                WebkitMaskPosition: "center right"
              }}
            ></div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="px-8 mb-12 max-w-7xl mx-auto w-full">
          <div className="bg-slate-50 p-2 rounded-xl flex flex-col md:flex-row gap-2 border border-slate-100">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-elm" />
              <input
                className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-lg focus:ring-2 focus:ring-elm/20 outline-none text-codgray shadow-sm"
                placeholder="Search by topic, author, or keyword..."
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="flex md:flex-row flex-col gap-2">
              <div className="relative group">
                <select
                  className="appearance-none w-full md:w-auto bg-white border-none px-6 py-4 pr-12 rounded-lg text-codgray font-medium focus:ring-2 focus:ring-elm/20 outline-none cursor-pointer shadow-sm"
                  value={topicFilter}
                  onChange={(e) => { setTopicFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option>Topic</option>
                  <option>Scholarships</option>
                  <option>Application Tips</option>
                  <option>Student Life</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-codgray" />
              </div>
              <div className="relative group">
                <select
                  className="appearance-none w-full md:w-auto bg-white border-none px-6 py-4 pr-12 rounded-lg text-codgray font-medium focus:ring-2 focus:ring-elm/20 outline-none cursor-pointer shadow-sm"
                  value={authorFilter}
                  onChange={(e) => { setAuthorFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option>Author</option>
                  <option>Mentors</option>
                  <option>Students</option>
                  <option>Advisors</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-codgray" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-6 items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-bombay pr-2">Popular:</span>
            <button
              onClick={() => { setSearchQuery("Interview Tips"); setCurrentPage(1); }}
              className="px-4 py-1.5 bg-elm/10 text-elm rounded-full text-xs font-medium hover:bg-elm/20 transition-colors"
            >
              Interview Tips
            </button>
            <button
              onClick={() => { setSearchQuery("Visa"); setCurrentPage(1); }}
              className="px-4 py-1.5 bg-white border border-slate-200 text-codgray hover:bg-slate-50 rounded-full text-xs font-medium transition-colors"
            >
              Study Visas
            </button>
            <button
              onClick={() => { setSearchQuery("Essay"); setCurrentPage(1); }}
              className="px-4 py-1.5 bg-white border border-slate-200 text-codgray hover:bg-slate-50 rounded-full text-xs font-medium transition-colors"
            >
              Essay Guides
            </button>
            <button
              onClick={() => { setTopicFilter("Scholarships"); setCurrentPage(1); }}
              className="px-4 py-1.5 bg-white border border-slate-200 text-codgray hover:bg-slate-50 rounded-full text-xs font-medium transition-colors"
            >
              Funding
            </button>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="px-8 max-w-7xl mx-auto w-full flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentBlogs.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-500">
                No blogs found matching your criteria.
              </div>
            ) : (
              currentBlogs.map((blog) => (
                <div key={blog.id} className="relative bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-all flex flex-col group h-full">
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

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
