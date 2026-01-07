import { fetchQuotesAPI } from "@/app/_modules/insurance/service/fetchQuotesAPI";
import NavigationWrapper from "@/app/_modules/insurance/components/organisms/NavigationWrapper";
import { buildWebPageJsonLd, generatePageMetadata } from "@/app/_libs/seo";
import Script from "next/script";
import { getDictionary } from "@/app/_libs/getDictionary";
import NoInsurancePlans from "@/app/_modules/insurance/components/molecules/NoInsurancePlans";
import CardsWrapper from "@/app/_modules/insurance/components/molecules/CardsWrapper";


export async function generateMetadata({ params }) {
    const locale = (await params)?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    return generatePageMetadata({
        locale,
        path: "/insurance/results",
        title: dict.InsurancePage?.Results.metaTitle,
        description: dict.InsurancePage?.Results.metaDescription,
        keywords: dict.InsurancePage?.Results.metaKeywords,
    });
}

async function page({ params, searchParams }) {

    const locale = (await params)?.locale || DEFAULT_LOCALE;
    const dict = await getDictionary(locale);

    const jsonLd = buildWebPageJsonLd({
        locale,
        path: "/insurance",
        title: dict.InsurancePage?.Results.metaTitle,
        description: dict.InsurancePage?.Results.metaDescription,
        keywords: dict.InsurancePage?.Results.metaKeywords,
    });

    const body = await searchParams
    const { data } = await fetchQuotesAPI(body);


    return <section className="min-h-screen" >
        <Script
            id="insurance/results"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NavigationWrapper />
        {!data ? <NoInsurancePlans /> : <CardsWrapper data={data.quotes} />}
    </section>
}

export default page

