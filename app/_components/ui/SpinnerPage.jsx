function SpinnerPage() {
    return (
        <section className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/10 backdrop-blur-xs">
            <div className="loader"></div>
        </section>
    );
}

export default SpinnerPage;
