import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import MainNavbar from "@/components/navbar/MainNavbar";
import Footer from "@/components/landing/Footer";
import CategoryIcon from "@/components/categories/CategoryIcon";
import ServiceListingCard from "@/components/categories/ServiceListingCard";
import { getCategoryBySlug, getPublicServices } from "@/lib/categories";

const PAGE_SIZE = 12;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug).catch(() => null);
  if (!category) return { title: "Category not found | Agaaw" };
  return {
    title: `${category.name} mentors | Agaaw`,
    description: category.description ?? undefined,
  };
}

/**
 * Generic hub for one category: who offers what, at what price. Study abroad
 * has its own richer page, so it redirects there instead.
 */
export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  if (slug === "study-abroad") redirect("/study-abroad");

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const page = Math.max(1, Number((await searchParams).page) || 1);
  const services = category.isActive
    ? await getPublicServices({ categoryId: category.id, page, limit: PAGE_SIZE })
    : null;
  const totalPages = services?.meta.totalPages ?? 0;

  return (
    <>
      <MainNavbar />

      <main className="min-h-screen bg-[#F8FAFC]">
        {/* Header */}
        <section className="bg-white border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-elm/10 text-elm shrink-0">
              <CategoryIcon name={category.icon} size={30} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-bold text-codgray tracking-tight">{category.name}</h1>
                {!category.isActive && (
                  <span className="inline-flex items-center whitespace-nowrap rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Coming soon
                  </span>
                )}
              </div>
              {category.description && (
                <p className="mt-3 max-w-2xl text-base md:text-lg text-bombay leading-relaxed">{category.description}</p>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          {!services ? (
            <EmptyState
              title="We're getting this category ready"
              body="Mentors can't list services here yet. Check back soon."
            />
          ) : services.data.length === 0 ? (
            <EmptyState
              title="No services listed yet"
              body="Mentors in this category haven't added services yet. Are you an expert here?"
              cta={{ href: "/register/mentor", label: "Become a mentor" }}
            />
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6">
                {services.meta.total} service{services.meta.total === 1 ? "" : "s"} available
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.data.map((service) => (
                  <ServiceListingCard key={service.id} service={service} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-3">
                  <PageLink slug={slug} page={page - 1} disabled={page <= 1} label="Previous">
                    <ChevronLeft size={16} /> Previous
                  </PageLink>
                  <span className="text-sm text-gray-500">
                    Page {page} of {totalPages}
                  </span>
                  <PageLink slug={slug} page={page + 1} disabled={page >= totalPages} label="Next">
                    Next <ChevronRight size={16} />
                  </PageLink>
                </nav>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

function EmptyState({ title, body, cta }: { title: string; body: string; cta?: { href: string; label: string } }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 py-16 px-6 text-center">
      <SearchX size={40} className="mx-auto mb-3 text-gray-300" />
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{body}</p>
      {cta && (
        <Link
          href={cta.href}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-5 py-2.5 transition-colors"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}

/** Pagination as plain links, so this page stays a server component. */
function PageLink({
  slug,
  page,
  disabled,
  label,
  children,
}: {
  slug: string;
  page: number;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const className =
    "inline-flex items-center gap-1 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors";
  if (disabled) {
    return (
      <span aria-disabled="true" className={`${className} border-gray-100 text-gray-300`}>
        {children}
      </span>
    );
  }
  return (
    <Link
      href={`/categories/${slug}?page=${page}`}
      aria-label={`${label} page`}
      className={`${className} border-gray-200 text-gray-700 hover:bg-gray-50`}
    >
      {children}
    </Link>
  );
}
