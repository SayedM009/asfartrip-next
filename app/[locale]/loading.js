import SpinnerMini from "../_components/SpinnerMini";

function loading() {
    return (
        <section className="w-screen h-screen flex items-center justify-center bg-accent-200">
            <SpinnerMini />
        </section>
    );
}

export default loading;
