export default function Loading() {
    return (
        <section className="fixed inset-0 z-[9999] flex items-center justify-center bg-background backdrop-blur-sm">
            <div className="loader"></div>
        </section>
    );
}
