"use client";

import { useParams } from "next/navigation";
import AnnouncementDetailPage from "@/components/notifications/AnnouncementDetailPage";

export default function MentorAnnouncementPage() {
  const params = useParams<{ id: string }>();
  return <AnnouncementDetailPage dashboardRole="mentor" announcementId={params.id} />;
}
