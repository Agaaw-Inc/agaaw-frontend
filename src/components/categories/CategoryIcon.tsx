import { Briefcase, FlaskConical, Plane, Scale, Sparkles, Store, type LucideIcon } from "lucide-react";

/**
 * Categories store a lucide icon *name* ("briefcase") so the list can grow
 * from the database. Unknown names fall back to a neutral icon instead of
 * breaking the page.
 */
const ICONS: Record<string, LucideIcon> = {
  plane: Plane,
  briefcase: Briefcase,
  store: Store,
  "flask-conical": FlaskConical,
  scale: Scale,
};

export default function CategoryIcon({ name, size = 26 }: { name: string | null; size?: number }) {
  const Icon = (name && ICONS[name]) || Sparkles;
  return <Icon size={size} strokeWidth={2} />;
}
