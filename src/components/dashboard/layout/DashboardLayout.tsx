import DashboardNavbar from "./DashboardNavbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-light">
      {/* Navbar */}
      <DashboardNavbar />

      {/* Main Content */}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
