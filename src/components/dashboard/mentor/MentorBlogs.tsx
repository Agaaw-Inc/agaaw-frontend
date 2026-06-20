"use client";

import React from "react";
import Image from "next/image";
import { Plus, Eye, ThumbsUp, MessageSquare } from "lucide-react";

export default function MentorBlogs() {
    const blogs = [
        {
            id: "1",
            title: "How to craft the perfect SOP for German Universities",
            image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=2070&auto=format&fit=crop",
            date: "Oct 10, 2023",
            status: "Published",
            views: "1.2K",
            likes: "340",
            comments: "45"
        },
        {
            id: "2",
            title: "Navigating the Visa Process: A Step-by-Step Guide",
            image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop",
            date: "Oct 05, 2023",
            status: "Draft",
            views: "-",
            likes: "-",
            comments: "-"
        }
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Blog & Resources</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your published content and drafts.</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                    <Plus size={18} />
                    Create New Blog
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blogs.map(blog => (
                    <div key={blog.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col group">
                        <div className="relative h-40 w-full overflow-hidden">
                            <Image 
                                src={blog.image} 
                                alt={blog.title} 
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 right-3">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                                    blog.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                    {blog.status}
                                </span>
                            </div>
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                            <p className="text-xs text-gray-500 font-semibold mb-1">{blog.date}</p>
                            <h3 className="font-bold text-gray-900 text-base mb-4 line-clamp-2">{blog.title}</h3>
                            
                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-gray-500">
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                                        <Eye size={14} /> {blog.views}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                                        <ThumbsUp size={14} /> {blog.likes}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                                        <MessageSquare size={14} /> {blog.comments}
                                    </div>
                                </div>
                                <button className="text-teal-600 hover:text-teal-700 text-xs font-bold">Edit</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
