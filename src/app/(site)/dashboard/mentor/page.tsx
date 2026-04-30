import Link from "next/link";
import {
  Users, Star, Wallet, CalendarCheck, BookOpen,
  PenSquare, MapPin, Award, TrendingUp, MessageSquare,
  CheckCircle2, Circle, ArrowRight, Clock, Sparkles
} from "lucide-react";
import { MOCK_BLOGS } from "@/lib/mock/blogData";
import { MOCK_STUDENTS } from "@/lib/mock/profileData";
import Footer from "@/components/landing/Footer";

/* ─── Hero Banner ─────────────────────────────────────────────────── */
function HeroBanner() {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-500 p-8 text-white shadow-xl">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            AR
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
            <Sparkles size={10} className="text-white" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">Arif Rahman</h1>
            <span className="px-2 py-0.5 bg-white/20 rounded-lg text-xs font-medium">Verified</span>
          </div>
          <p className="text-teal-100 font-medium mb-1">Scholarship Consultant · Study Abroad Expert</p>
          <div className="flex items-center gap-1.5 text-teal-200 text-sm">
            <MapPin size={13} />
            <span>Dhaka, Bangladesh</span>
          </div>

          {/* Inline stats */}
          <div className="flex flex-wrap gap-4 mt-4">
            {[
              { label: "Students", value: "47" },
              { label: "Rating", value: "4.9 ★" },
              { label: "Sessions", value: "128" },
              { label: "Blogs", value: "3" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-xs text-teal-200">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2 shrink-0">
          <Link
            href="/dashboard/mentor/blogs/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 rounded-xl font-semibold text-sm hover:bg-teal-50 transition-colors shadow-sm"
          >
            <PenSquare size={15} />
            Write Blog
          </Link>
          <Link
            href="/dashboard/mentor/profile"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white border border-white/20 rounded-xl font-medium text-sm hover:bg-white/20 transition-colors"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Stat Card ───────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
        {sub && <p className="text-xs text-teal-600 font-medium mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/* ─── Profile Completion ─────────────────────────────────────────── */
const CHECKLIST = [
  { label: "Profile Photo", done: true },
  { label: "Bio & Expertise", done: false },
  { label: "Education & Credentials", done: false },
  { label: "Service Offerings", done: true },
  { label: "Availability Schedule", done: true },
];
const progress = Math.round((CHECKLIST.filter(c => c.done).length / CHECKLIST.length) * 100);

function ProfileCompletion() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">Profile Completion</h3>
          <p className="text-xs text-gray-500 mt-0.5">Complete your profile to attract more students</p>
        </div>
        <span className="text-2xl font-bold text-teal-700">{progress}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-3">
        {CHECKLIST.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            {item.done ? (
              <CheckCircle2 size={18} className="text-teal-600 shrink-0" />
            ) : (
              <Circle size={18} className="text-gray-300 shrink-0" />
            )}
            <span className={`text-sm ${item.done ? "text-gray-700" : "text-gray-400"}`}>
              {item.label}
            </span>
            {!item.done && (
              <span className="ml-auto text-xs text-teal-600 font-medium bg-teal-50 px-2 py-0.5 rounded-full">
                Complete
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Recent Blogs ───────────────────────────────────────────────── */
function RecentBlogs() {
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

/* ─── Upcoming Sessions ──────────────────────────────────────────── */
// Some random students from MOCK_STUDENTS
const SESSIONS = [
  { student: "John Smith", title: "Application Review", datetime: "Apr 10, 2026 · 2:00 PM" },
  { student: "Emily Chen", title: "University Selection", datetime: "Apr 11, 2026 · 10:00 AM" },
  { student: "David Park", title: "Visa Guidance", datetime: "Apr 13, 2026 · 4:00 PM" },
];

function UpcomingSessions() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Upcoming Sessions</h3>
        <span className="text-xs bg-teal-50 text-teal-700 font-semibold px-2 py-0.5 rounded-full">
          {SESSIONS.length} scheduled
        </span>
      </div>
      <div className="space-y-3">
        {SESSIONS.map((s, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-teal-200 hover:bg-teal-50/30 transition-all">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {s.student.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <Link href={`/profile/${s.student}`} className="hover:text-teal-700 transition-colors">
                <p className="text-sm font-medium text-gray-900">{s.student}</p>
              </Link>
              <p className="text-xs text-gray-500">{s.title}</p>
              {/* show the datetime in the right side of the card */}
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-400">{s.datetime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Performance ────────────────────────────────────────────────── */
const PERFORMANCE = [
  { label: "Response Rate", value: 95, color: "from-teal-500 to-emerald-500" },
  { label: "Satisfaction", value: 98, color: "from-violet-500 to-purple-500" },
  { label: "Booking Rate", value: 88, color: "from-blue-500 to-indigo-500" },
];

function Performance() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Performance</h3>
      <div className="space-y-4">
        {PERFORMANCE.map((m) => (
          <div key={m.label}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm text-gray-600">{m.label}</span>
              <span className="text-sm font-bold text-gray-900">{m.value}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${m.color}`}
                style={{ width: `${m.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Recent Messages ────────────────────────────────────────────── */
const MESSAGES = [
  { name: "Sarah Johnson", message: "Inquiry about UK universities", time: "2h ago", isNew: true },
  { name: "Ahmed Hassan", message: "Scholarship guidance needed", time: "5h ago", isNew: false },
  { name: "Maria Garcia", message: "CV review request", time: "1d ago", isNew: true },
];

function RecentMessages() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Messages</h3>
        <span className="text-xs bg-red-50 text-red-600 font-semibold px-2 py-0.5 rounded-full">
          {MESSAGES.filter(m => m.isNew).length} new
        </span>
      </div>
      <div className="space-y-3">
        {MESSAGES.map((m, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {m.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-gray-900">{m.name}</p>
                <span className="text-xs text-gray-400 shrink-0">{m.time}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 truncate">{m.message}</p>
            </div>
            {m.isNew && <div className="w-2 h-2 bg-teal-500 rounded-full shrink-0 mt-1.5" />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Quick Actions ──────────────────────────────────────────────── */
function QuickActions() {
  const actions = [
    { label: "Write Blog", href: "/dashboard/mentor/blogs/create", icon: PenSquare, color: "bg-teal-600" },
    { label: "My Blogs", href: "/dashboard/mentor/blogs", icon: BookOpen, color: "bg-violet-600" },
    { label: "View Students", href: "#", icon: Users, color: "bg-blue-600" },
    { label: "Schedule", href: "#", icon: CalendarCheck, color: "bg-amber-600" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-transparent hover:shadow-md transition-all hover:-translate-y-0.5 group"
          >
            <div className={`w-10 h-10 ${a.color} rounded-xl flex items-center justify-center`}>
              <a.icon size={18} className="text-white" />
            </div>
            <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors text-center">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────── */
export default function MentorDashboardPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Hero */}
      <HeroBanner />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Students" value="47" sub="+3 this month" color="bg-teal-600" />
        <StatCard icon={Star} label="Avg Rating" value="4.9" sub="Based on 38 reviews" color="bg-amber-500" />
        <StatCard icon={Wallet} label="This Month" value="$2,450" sub="+18% from last" color="bg-violet-600" />
        <StatCard icon={CalendarCheck} label="Sessions Done" value="128" sub="12 upcoming" color="bg-blue-600" />
      </div>

      {/* Main 2-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileCompletion />
          <RecentBlogs />
          <UpcomingSessions />
        </div>

        {/* Right (1/3) */}
        <div className="space-y-6">
          <Performance />
          <RecentMessages />
          <QuickActions />
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}
