import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfilePopoverProps {
  onClose: () => void;
}

export default function ProfilePopover({ onClose }: ProfilePopoverProps) {
  const router = useRouter();
  
  return (
    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
      <div className="px-4 py-3 border-b border-gray-50 mb-2">
        <p className="font-semibold text-gray-900">Faruk Khan</p>
        <p className="text-xs text-gray-500">faruk@example.com</p>
      </div>
      <Link href="/dashboard/student/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors" onClick={onClose}>
        <div className="bg-gray-100 p-1.5 rounded-full"><User size={16} className="text-gray-600" /></div> Profile
      </Link>
      <button onClick={() => { onClose(); router.push("/"); }} className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
        <div className="bg-red-50 p-1.5 rounded-full"><LogOut size={16} className="text-red-500" /></div> Sign Out
      </button>
    </div>
  );
}
