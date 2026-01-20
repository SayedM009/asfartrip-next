import Footer from "@/app/_components/footer/Footer";

function layout({ children }) {
    return (
        <section className="container-custom min-h-screen">
            {children}
            <Footer />
        </section>
    );
}

export default layout;
