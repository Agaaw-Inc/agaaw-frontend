import Image from "next/image";
import type { MessageParticipant } from "@/data/messages";

interface ParticipantAvatarProps {
  participant: MessageParticipant;
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
  const initials = participant.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <div className={`relative shrink-0 ${sizeClasses[size]}`}>
      <div className="h-full w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-sm">
        {participant.avatar ? (
          <Image
            src={participant.avatar}
            alt={participant.name}
            width={56}
            height={56}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-900 font-semibold text-white">
            {initials}
          </div>
        )}
      </div>
      {showStatus && participant.isOnline && (
        <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
      )}
    </div>
  );
}

