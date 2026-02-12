interface InfoSectionProps {
    title: string;
    children: React.ReactNode;
}

export default function InfoSection({ title, children }: InfoSectionProps) {
    return (
        <section className="py-2 px-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>
            <div className="bg-white rounded-lg shadow p-5 text-gray-700">
                {children}
            </div>
        </section>
    );
}