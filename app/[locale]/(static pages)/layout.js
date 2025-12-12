import BottomAppBar from "@/app/_components/bottomAppBar/BottomAppBar";
import Footer from "@/app/_components/footer/Footer";
import Navbar from "@/app/_components/navigation/Navbar";

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
