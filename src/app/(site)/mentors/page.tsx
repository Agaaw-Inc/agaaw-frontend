"use client";

import { Suspense, useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import HomeHero from "@/components/home/HomeHero";
import MentorCallout from "@/components/home/MentorCallout";
import MentorCard, { type MentorCardViewer } from "@/components/mentors/MentorCard";
import EmptyState from "@/components/ui/EmptyState";
import Button, { ButtonLink } from "@/components/ui/Button";
import { fromPublicCard, fromStudentList, type MentorCardData } from "@/lib/mentorCards";
import RequestMentorshipModal from "@/components/mentors/RequestMentorshipModal";
import OrderServiceModal from "@/components/orders/OrderServiceModal";
import Pagination from "@/components/ui/Pagination";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { useGridColumns } from "@/hooks/useGridColumns";
import { getUserInfo, getToken, type UserInfo } from "@/lib/auth";
import { getConnections, getMentorCount, getMentorsList, getMentorshipRequests, getScholarships } from "@/lib/api";
import { getCategories, getPublicMentorDirectory, type CategoryWithCount } from "@/lib/categories";
import SectionHeading from "@/components/ui/SectionHeading";

/** Who is looking: undefined while rendering on the server (not known yet). */
function readViewer(): UserInfo | null {
  return getToken() ? getUserInfo() : null;
}
function subscribeToAuth(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("agaaw-auth-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("agaaw-auth-change", onChange);
  };
}

const ROWS_PER_PAGE = 5;
const CARD_MIN_WIDTH = 240;
const GAP = 20;

type RequestStatus = "none" | "pending" | "connected";

function MentorDirectory() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { toast, showToast, hideToast } = useToast();

  // Filters live in the URL, so a filtered view can be shared or bookmarked.
  const category = searchParams.get("category") ?? "";
  const country = searchParams.get("country") ?? "";
  const university = searchParams.get("university") ?? "";
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // undefined on the server, then the real answer on the client.
  const viewer = useSyncExternalStore(subscribeToAuth, readViewer, () => undefined);
  const authReady = viewer !== undefined;
  const user = viewer ?? null;
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [mentorCount, setMentorCount] = useState(0);
  const [scholarshipCount, setScholarshipCount] = useState(0);

  const [mentors, setMentors] = useState<MentorCardData[]>([]);
  const [publicMeta, setPublicMeta] = useState<{ total: number; limit: number; countries: string[]; universities: string[] } | null>(null);
  // Loading is derived, not toggled: the page is loading whenever the data
  // on screen was fetched for a different viewer/filter combination.
  // Students get the whole list once and filter it here, so their key never
  // changes with filters; guests refetch so the top-rated cap applies.
  const fetchKey = user?.role === "student" ? "student" : `guest|${category}|${country}|${university}`;
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [statusMap, setStatusMap] = useState<Record<string, RequestStatus>>({});
  const [connectionIds, setConnectionIds] = useState<Record<string, string>>({});
  const [requestTarget, setRequestTarget] = useState<{ id: string; name: string } | null>(null);
  const [orderTarget, setOrderTarget] = useState<{ id: string; name: string; connectionId: string } | null>(null);

  const isStudent = user?.role === "student";
  const { ref: gridRef, columns } = useGridColumns(CARD_MIN_WIDTH, GAP);
  const pageSize = columns * ROWS_PER_PAGE;

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
    getMentorCount().then(setMentorCount).catch(() => {});
    getScholarships({ limit: 1 }).then((r) => setScholarshipCount(r.meta.total)).catch(() => {});
  }, []);

  // Students: the whole directory once, filtered here. Everyone else: the
  // public directory, filtered by the server so the top-rated cap applies
  // to the filtered set.
  useEffect(() => {
    if (!authReady) return;
    let alive = true;
    const key = fetchKey;

    const load = async () => {
      if (isStudent) {
        const [list, pending, active] = await Promise.all([
          getMentorsList(),
          getMentorshipRequests({ status: "pending", limit: 50 }).catch(() => ({ data: [] })),
          getConnections("active").catch(() => []),
        ]);
        if (!alive) return;
        const status: Record<string, RequestStatus> = {};
        const conns: Record<string, string> = {};
        pending.data.forEach((r: { mentorId: string }) => (status[r.mentorId] = "pending"));
        active.forEach((c) => {
          status[c.counterpart.id] = "connected";
          conns[c.counterpart.id] = c.id;
        });
        setStatusMap(status);
        setConnectionIds(conns);
        setMentors(list.map(fromStudentList));
        setPublicMeta(null);
      } else {
        const directory = await getPublicMentorDirectory({ category, country, university });
        if (!alive) return;
        setMentors(directory.mentors.map(fromPublicCard));
        setPublicMeta({ total: directory.total, limit: directory.limit, ...directory.filters });
      }
    };

    load()
      .catch(() => alive && showToast("Couldn't load mentors. Please try again.", "error"))
      .finally(() => alive && setLoadedKey(key));
    return () => {
      alive = false;
    };
    // fetchKey captures everything that should trigger a refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authReady, fetchKey, showToast]);

  const isLoading = loadedKey !== fetchKey;

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(searchParams.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      setPage(1);
    },
    [pathname, router, searchParams]
  );

  const clearFilters = () => {
    setSearch("");
    router.replace(pathname, { scroll: false });
    setPage(1);
  };

  const countryOptions = useMemo(
    () => publicMeta?.countries ?? [...new Set(mentors.map((m) => m.country).filter(Boolean) as string[])].sort(),
    [publicMeta, mentors]
  );
  const universityOptions = useMemo(
    () => publicMeta?.universities ?? [...new Set(mentors.map((m) => m.university).filter(Boolean) as string[])].sort(),
    [publicMeta, mentors]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mentors.filter((m) => {
      // The public endpoint already applied these; re-applying is harmless.
      if (category && !m.categories.some((c) => c.slug === category)) return false;
      if (country && m.country?.toLowerCase() !== country.toLowerCase()) return false;
      if (university && !m.university?.toLowerCase().includes(university.toLowerCase())) return false;
      if (!q) return true;
      return [m.name, m.university, m.subject, ...m.expertise].some((v) => v?.toLowerCase().includes(q));
    });
  }, [mentors, category, country, university, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const hasFilters = !!(category || country || university || search);
  const activeCategory = categories.find((c) => c.slug === category);

  const viewerFor = (m: MentorCardData): MentorCardViewer => {
    if (!user) return { kind: "guest" };
    if (!isStudent) return { kind: "other" };
    return {
      kind: "student",
      status: statusMap[m.id] ?? "none",
      onRequest: () => setRequestTarget({ id: m.id, name: m.name }),
      onOrder: connectionIds[m.id]
        ? () => setOrderTarget({ id: m.id, name: m.name, connectionId: connectionIds[m.id] })
        : undefined,
    };
  };

  const selectClass =
    "w-full rounded-xl border border-ink/15 bg-card px-3 py-2.5 text-sm text-ink focus:border-elm focus:outline-none sm:w-48";

  return (
    <div className="min-h-screen bg-paper">
      <MainNavbar />

      <HomeHero
        categories={categories}
        mentorCount={mentorCount}
        scholarshipCount={scholarshipCount}
        chipTarget="filter"
        activeCategory={category}
      />

      <main id="directory" className="mx-auto max-w-[1600px] px-6 py-14">
        {/* Filters */}
        <div className="flex flex-col gap-3 rounded-2xl bg-card p-3 ring-1 ring-ink/10 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search mentors</span>
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, university or expertise"
              className="w-full rounded-xl bg-transparent py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-ink-soft focus:outline-none"
            />
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <select aria-label="Category" value={category} onChange={(e) => setParam("category", e.target.value)} className={selectClass}>
              <option value="">All categories</option>
              {categories.filter((c) => c.isActive).map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <select aria-label="Country" value={country} onChange={(e) => setParam("country", e.target.value)} className={selectClass}>
              <option value="">All countries</option>
              {countryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select aria-label="University" value={university} onChange={(e) => setParam("university", e.target.value)} className={selectClass}>
              <option value="">All universities</option>
              {universityOptions.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <SectionHeading
          size="card"
          title={activeCategory ? `${activeCategory.name} mentors` : "All mentors"}
          className="mt-8 mb-6 border-b border-ink/10 pb-4"
          action={
          <div className="flex items-center gap-4 text-sm text-ink-soft">
            {!isLoading && <span>{filtered.length} mentor{filtered.length === 1 ? "" : "s"}</span>}
            {hasFilters && (
              <button onClick={clearFilters} className="inline-flex items-center gap-1 font-semibold text-ink hover:underline">
                <X size={14} /> Clear filters
              </button>
            )}
          </div>
          }
        />

        {/* Guests see the top-rated few; the full directory needs an account */}
        {!user && publicMeta && publicMeta.total > publicMeta.limit && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-forest px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">
              You&apos;re seeing the <strong>{publicMeta.limit} top-rated</strong> of {publicMeta.total} mentors. Create a free account to see
              everyone and request mentorship.
            </p>
            <div className="flex shrink-0 gap-2">
              <ButtonLink href="/register/student" variant="light" size="sm">
                Sign up free
              </ButtonLink>
              <ButtonLink href={`/login?redirect=${encodeURIComponent("/mentors")}`} variant="outline" size="sm" className="border-white/40 text-white hover:border-white">
                Log in
              </ButtonLink>
            </div>
          </div>
        )}

        <div ref={gridRef}>
          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-elm" />
            </div>
          ) : visible.length === 0 ? (
            <EmptyState
              title="No mentors match these filters"
              body="Try another country or university, or clear the filters."
              action={hasFilters ? <Button size="sm" onClick={clearFilters}>Clear filters</Button> : undefined}
            />
          ) : (
            <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: GAP }}>
              {visible.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} viewer={viewerFor(mentor)} />
              ))}
            </div>
          )}
        </div>

        <Pagination
          className="mt-12"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => {
            setPage(p);
            document.getElementById("directory")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </main>

      <MentorCallout />
      <Footer />

      {requestTarget && (
        <RequestMentorshipModal
          mentorId={requestTarget.id}
          mentorName={requestTarget.name}
          onClose={() => setRequestTarget(null)}
          onSuccess={() => {
            setStatusMap((prev) => ({ ...prev, [requestTarget.id]: "pending" }));
            setRequestTarget(null);
            showToast("Mentorship request sent!");
          }}
        />
      )}
      {orderTarget && (
        <OrderServiceModal
          connectionId={orderTarget.connectionId}
          mentorId={orderTarget.id}
          mentorName={orderTarget.name}
          onClose={() => setOrderTarget(null)}
        />
      )}
      <Toast toast={toast} onHide={hideToast} />
    </div>
  );
}

export default function MentorsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-paper">
          <Loader2 className="h-8 w-8 animate-spin text-elm" />
        </div>
      }
    >
      <MentorDirectory />
    </Suspense>
  );
}
