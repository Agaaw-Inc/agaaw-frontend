"use client";

import { useParams } from "next/navigation";
import AnnouncementDetailPage from "@/components/notifications/AnnouncementDetailPage";

export default function StudentAnnouncementPage() {
  const params = useParams<{ id: string }>();
  return <AnnouncementDetailPage dashboardRole="student" announcementId={params.id} />;
}
