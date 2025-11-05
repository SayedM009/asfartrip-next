// import ProfileOnMobile from "@/app/_components/profile/Profile";
// // import useIsDevice from "@/app/_hooks/useIsDevice";
// import { getDictionary } from "@/app/_libs/getDictionary";
// import { generateMetadataObj } from "@/app/_libs/metadata";

import ProfileOnMobile from "@/app/_components/profile/mobile/ProfileOnMobile";

// export async function generateMetadata({ params }) {
//     const locale = (await params).locale || "en";
//     const dict = await getDictionary(locale);

//     return generateMetadataObj({
//         title: dict.Profile.title,
//         description: dict.Profile.description,
//         url: "https://www.asfartrip.com/",
//         locale: locale || "en",
//     });
// }

// function Page() {
//     const { mobile } = useIsDevice();
//     if (mobile) return <ProfileOnMobile />;
//     return <div>profile</div>;
// }

// export default Page;

function page() {
    return <ProfileOnMobile />;
}

export default page;
