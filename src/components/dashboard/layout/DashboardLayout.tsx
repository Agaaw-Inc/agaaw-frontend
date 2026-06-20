import MainNavbar from "@/components/navbar/MainNavbar";
import GlobalChatPopup from "@/components/navbar/GlobalChatPopup";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col relative">
            {/* Navbar */}
            <MainNavbar />

            {/* Main Content */}
            <main className="w-full flex-1">
                {children}
            </main>

            {/* Floating Chat */}
            <GlobalChatPopup />
        </div>
    );
}
