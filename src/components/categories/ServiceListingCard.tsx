import Link from "next/link";
import { Clock, Package, Video } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { resolveFileUrl } from "@/lib/api";
import { formatTaka } from "@/lib/orders";
import { DELIVERY_TYPE_LABELS, type PublicMentorService } from "@/lib/categories";

/** One mentor service on a category page. Styled like MentorServicesCard. */
export default function ServiceListingCard({ service }: { service: PublicMentorService }) {
  const { mentor } = service;
  const mentorName = `${mentor.firstName} ${mentor.lastName}`.trim();
  const DeliveryIcon = service.deliveryType === "session" ? Video : Package;

  return (
    <div className="border border-gray-100 rounded-xl p-5 hover:shadow-md hover:border-gray-200 transition-all relative bg-white flex flex-col h-full">
      {/* Top accent */}
      <div className="absolute top-0 left-5 right-5 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-b-full" />

      <h3 className="text-base font-bold text-gray-900 mb-2">{service.title}</h3>
      {service.description && (
        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">{service.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span className="text-lg font-bold text-teal-700">{formatTaka(service.price)}</span>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <DeliveryIcon size={12} />
          {DELIVERY_TYPE_LABELS[service.deliveryType]}
        </span>
        {service.duration && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={12} />
            {service.duration}
          </span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-gray-50 pt-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-teal-50 flex items-center justify-center text-teal-700 font-bold text-xs shrink-0">
            <Avatar src={resolveFileUrl(mentor.profileImage)} name={mentorName || "?"} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{mentorName}</p>
            {mentor.currentUniversity && (
              <p className="text-xs text-gray-500 truncate">{mentor.currentUniversity}</p>
            )}
          </div>
        </div>
        <Link
          href={`/profile/mentor/${mentor.id}`}
          className="shrink-0 inline-flex items-center justify-center rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-4 py-2 transition-colors"
        >
          View mentor
        </Link>
      </div>
    </div>
  );
}
