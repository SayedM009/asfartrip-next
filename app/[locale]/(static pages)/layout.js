import BottomAppBar from "@/app/_components/layout/bottomAppBar/BottomAppBar";
import Footer from "@/app/_components/layout/footer/Footer";
import Navbar from "@/app/_components/layout/Navbar";

function layout({ children }) {
    return (
        <section className="container-custom">
            <Navbar />
            {children}
            <Footer />
            <BottomAppBar />
        </section>
    );
}

export default layout;
