import Navbar from "@/app/_components/Navbar";

async function Page({ searchParams }) {
    const searchObject = searchParams.searchObject
        ? JSON.parse(searchParams.searchObject)
        : {};

    return (
        <>
            <Navbar />
            <section></section>
        </>
    );
}

export default Page;
