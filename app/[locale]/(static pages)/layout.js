import BottomAppBar from "@/app/_components/bottomAppBar/BottomAppBar";
import { Footer } from "@/app/_components/Footer";
import Header from "@/app/_components/Navbar";

function layout({ children }) {
    return (
        <section className="container-custom">
            <Header />
            {children}
            <Footer />
            <BottomAppBar />
        </section>
    );
}

export default layout;
