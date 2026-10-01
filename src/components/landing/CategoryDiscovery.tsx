import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/lib/categories";
import CategoryIcon from "@/components/categories/CategoryIcon";

/**
 * "Need other support?" — every category except the highlighted one (study
 * abroad already owns the hero above). A server component: the list is
 * fetched at render time and cached, so it adds no client-side loading state.
 */
export default async function CategoryDiscovery() {
  const categories = (await getCategories()).filter((c) => !c.isHighlight);

  // API down or nothing to show: leave the homepage exactly as it was.
  if (categories.length === 0) return null;

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-3xl md:text-4xl font-medium tracking-tight leading-tight text-codgray">
          Need other support?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base md:text-lg text-bombay leading-relaxed">
          Agaaw mentors help with more than studying abroad. Find someone who has done what you&apos;re trying to do.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const body = (
              <>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-elm/10 text-elm">
                    <CategoryIcon name={category.icon} />
                  </div>
                  {!category.isActive && (
                    <span className="inline-flex items-center whitespace-nowrap rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      Coming soon
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-codgray">{category.name}</h3>
                {category.description && (
                  <p className="mt-2 text-sm text-bombay leading-relaxed flex-1">{category.description}</p>
                )}
                {category.isActive && (
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700">
                    Find a mentor
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </>
            );

            const cardClass =
              "group flex flex-col h-full rounded-2xl bg-white p-6 shadow-sm border border-bombay/20 transition-all";

            return category.isActive ? (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className={`${cardClass} hover:shadow-lg hover:border-elm/40`}
              >
                {body}
              </Link>
            ) : (
              <div key={category.id} aria-disabled="true" className={`${cardClass} opacity-70 cursor-default`}>
                {body}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
