import AuthBackground from "@/components/auth/AuthBackground";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <AuthBackground />
            <div className="relative z-10 w-full max-w-md">
                {children}
            </div>
        </div>
    );
}