// Formatting helpers for mentorship session date/time display (no date-fns dependency).

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const timeFormatter = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });
const dateFormatter = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" });

/** "Today, 4:00 PM" / "Tomorrow, 10:00 AM" / "Oct 12, 10:00 AM" */
export function formatSessionWhen(scheduledAt: string): string {
  const date = new Date(scheduledAt);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const time = timeFormatter.format(date);

  if (isSameLocalDay(date, now)) return `Today, ${time}`;
  if (isSameLocalDay(date, tomorrow)) return `Tomorrow, ${time}`;
  return `${dateFormatter.format(date)}, ${time}`;
}

export function formatSessionDateShort(scheduledAt: string): { month: string; day: string } {
  const date = new Date(scheduledAt);
  const month = new Intl.DateTimeFormat(undefined, { month: "short" }).format(date).toUpperCase();
  const day = String(date.getDate());
  return { month, day };
}

export function formatSessionTimeRange(scheduledAt: string, durationMinutes: number): string {
  const start = new Date(scheduledAt);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  return `${timeFormatter.format(start)} - ${timeFormatter.format(end)}`;
}
