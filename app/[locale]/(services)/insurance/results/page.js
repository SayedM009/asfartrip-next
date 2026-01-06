import { fetchQuotesAPI } from "@/app/_modules/insurance/service/fetchQuotesAPI";
import NavigationWrapper from "@/app/_modules/insurance/components/organisms/NavigationWrapper";
import CardsWrapper from "@/app/_modules/insurance/components/molecules/CardsWrapper";

async function page({ searchParams }) {
    const body = await searchParams
    const { ok, status, data } = await fetchQuotesAPI(body);
    return <section className="min-h-screen" >
        <NavigationWrapper />
        <CardsWrapper data={data.quotes} />
    </section>
}

export default page

