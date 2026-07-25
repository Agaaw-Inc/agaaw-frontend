import Avatar from "@/components/ui/Avatar";
import { resolveFileUrl } from "@/lib/api";
import { counterpartFullName, type ChatCounterpart } from "@/lib/chat";

interface ParticipantAvatarProps {
  participant: ChatCounterpart;
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
}

const sizeClasses = {
  sm: "h-9 w-9 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-14 w-14 text-base",
};

export default function ParticipantAvatar({
  participant,
  size = "md",
  showStatus = true,
}: ParticipantAvatarProps) {
  const name = counterpartFullName(participant);
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`relative shrink-0 ${sizeClasses[size]}`}>
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-900 font-semibold text-white shadow-sm">
        <Avatar
          src={participant.profileImage ? resolveFileUrl(participant.profileImage) : null}
          name={initials || "?"}
          alt={name}
        />
      </div>
      {showStatus && participant.isOnline && (
        <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
      )}
    </div>
  );
}
