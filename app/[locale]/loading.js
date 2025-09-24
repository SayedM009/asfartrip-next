import SpinnerMini from "../_components/SpinnerMini";

function loading() {
    return (
        <section className="fixed w-screen h-screen left-0 top-0 flex items-center justify-center">
            <SpinnerMini />
        </section>
    );
}

export default loading;
