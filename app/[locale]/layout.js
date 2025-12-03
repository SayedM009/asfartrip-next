// import { routing } from "@/i18n/routing";
// import { cairo } from "@/app/_libs/fonts";
// import { ThemeProvider } from "next-themes";
// import { NextIntlClientProvider } from "next-intl";
// import { getMessages } from "next-intl/server";
// import { Toaster } from "@/components/ui/sonner";
// import "./globals.css";
// import { AuthProvider } from "./providers";
// import { AlertCircle } from "lucide-react";
// import { CheckCircleIcon } from "@heroicons/react/24/solid";

// // WhiteLabe config Context
// import { getWebsiteConfig, WebsiteConfigProvider } from "../_modules/config";

// export function generateStaticParams() {
//     return routing.locales.map((locale) => ({ locale }));
// }

// export default async function RootLayout({ children, params }) {
//     const { locale } = await params;
//     const conditions = locale === "ar";
//     const messages = await getMessages();
//     const config = await getWebsiteConfig();

//     return (
//         <html
//             lang={locale}
//             dir={conditions ? "rtl" : "ltr"}
//             suppressHydrationWarning
//         >
//             <body className={`${cairo.className} antialiased`}>
//                 <AuthProvider>
//                     <WebsiteConfigProvider config={config}>
//                         <NextIntlClientProvider
//                             locale={locale}
//                             messages={messages}
//                         >
//                             <ThemeProvider
//                                 attribute="class"
//                                 enableSystem
//                                 defaultTheme="system"
//                             >
//                                 <main>{children}</main>
//                                 <Toaster
//                                     position="top-center"
//                                     duration={2000}
//                                     icons={{
//                                         success: (
//                                             <CheckCircleIcon className="text-green-500 size-5" />
//                                         ),
//                                         error: (
//                                             <AlertCircle className="rounded-full size-5 bg-red-500 text-white" />
//                                         ),
//                                     }}
//                                 />
//                             </ThemeProvider>
//                         </NextIntlClientProvider>
//                     </WebsiteConfigProvider>
//                 </AuthProvider>
//             </body>
//         </html>
//     );
// }


import { routing } from "@/i18n/routing";
import { cairo } from "@/app/_libs/fonts";
import { getMessages } from "next-intl/server";
import { getWebsiteConfig } from "../_modules/config/api/getWebsiteConfig";
import ClientLayout from "./ClientLayout";
import "./globals.css";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }) {
    const { locale } = await params;
    const isRTL = locale === "ar";
    const messages = await getMessages();
    // const config = await getWebsiteConfig();


    // ⚠️ TEMPORARY: Skip config until credentials are fixed
    // const config = {
    //     website: {
    //         id: '8',
    //         agent_id: '52',
    //         name: 'whitelabel-demo.asfartrip.com',
    //         url: 'https://whitelabel-demo.asfartrip.com',
    //         logo_url: 'images/yourlogo-high-resolution-logo.png',
    //         logo_url2: 'images/yourlogo-high-resolution-logo-grayscale.png',
    //         main_banner_url: 'masthead/1/bg_cities.jpg',
    //         address: 'S10, R1001 Al Wasl Aqua Building, Karama, Dubai, United Arab Emirates.',
    //         email: 'info@asfartrip.com',
    //         email2: 'support@asfartrip.com',
    //         phone: '+971(4)3409933',
    //         phone2: '+971(4)3409933',
    //         map_url: 'embed?pb=!1m18!1m12!1m3!1d3608.893095518152!2d55.29952857395!3d25.240525429947002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f61492407cd75%3A0x98af8805b3eedbac!2sAsfartrip%20-%20Online%20Travel%20Agency%20Dubai!5e0!3m2!1sen!2sae!4v1730007005892!5m2!1sen!2sae',
    //         custom_style: 'ZEdWemRBPT0=',
    //         created_at: '2024-02-13 11:20:52',
    //         updated_at: '2025-11-10 10:23:34',
    //         paymentOption: 'own_gateway',
    //         createApiAccount: '0',
    //         createB2BAccount: '0',
    //         defaultCurrency: null,
    //         defaultLanguage: null,
    //         appStoreUrl: null,
    //         googlePlayStoreUrl: null,
    //         website_id: '8',
    //         language_ids: '13,12,11,15,16,17,20,25,29,33',
    //         currency_ids: '145,180,181,182',
    //         payment_gateway_ids: '3,8,10',
    //         cards_accepted_ids: '1,2,8',
    //         social_media_ids: '1,2,3,6'
    //     },
    //     languages: [
    //         {
    //             language_id: '11',
    //             name: 'english',
    //             language: 'English',
    //             code: '1',
    //             ISO2: 'en',
    //             ISO3: 'ENG',
    //             direction: 'ltr',
    //             country: 'United States',
    //             country_code: null,
    //             active: '1'
    //         },
    //         {
    //             language_id: '12',
    //             name: 'spanish',
    //             language: 'Español',
    //             code: '64',
    //             ISO2: 'es',
    //             ISO3: 'SPA',
    //             direction: 'ltr',
    //             country: 'Spain',
    //             country_code: null,
    //             active: '1'
    //         },
    //         {
    //             language_id: '13',
    //             name: 'french',
    //             language: 'Français',
    //             code: '2',
    //             ISO2: 'fr',
    //             ISO3: 'FRA',
    //             direction: 'ltr',
    //             country: 'France',
    //             country_code: null,
    //             active: '1'
    //         },
    //         {
    //             language_id: '15',
    //             name: 'indonesian',
    //             language: 'Indonesian',
    //             code: '639',
    //             ISO2: 'id',
    //             ISO3: 'IND',
    //             direction: 'ltr',
    //             country: 'Indonesia',
    //             country_code: null,
    //             active: '1'
    //         },
    //         {
    //             language_id: '16',
    //             name: 'uzbek',
    //             language: 'ouszbek',
    //             code: '536870912',
    //             ISO2: 'uz',
    //             ISO3: 'UZB',
    //             direction: 'ltr',
    //             country: 'UZBEKISTAN',
    //             country_code: null,
    //             active: '1'
    //         },
    //         {
    //             language_id: '17',
    //             name: 'malay',
    //             language: 'Malay',
    //             code: '8192',
    //             ISO2: 'ms',
    //             ISO3: 'MAY',
    //             direction: 'ltr',
    //             country: 'MALAYSIA',
    //             country_code: null,
    //             active: '1'
    //         },
    //         {
    //             language_id: '20',
    //             name: 'portuguese',
    //             language: 'Português',
    //             code: '1024',
    //             ISO2: 'pt',
    //             ISO3: 'POR',
    //             direction: 'ltr',
    //             country: 'Brazil',
    //             country_code: null,
    //             active: '1'
    //         },
    //         {
    //             language_id: '25',
    //             name: 'filipino',
    //             language: 'Filipino',
    //             code: '8388608',
    //             ISO2: 'tl',
    //             ISO3: 'tgl',
    //             direction: 'ltr',
    //             country: 'PHILIPPINES',
    //             country_code: null,
    //             active: '1'
    //         },
    //         {
    //             language_id: '29',
    //             name: 'russian',
    //             language: 'Русский',
    //             code: '32',
    //             ISO2: 'ru',
    //             ISO3: 'RUS',
    //             direction: 'ltr',
    //             country: 'RUSSIA',
    //             country_code: null,
    //             active: '1'
    //         },
    //         {
    //             language_id: '33',
    //             name: 'arabic',
    //             language: 'العربية',
    //             code: '256',
    //             ISO2: 'ar',
    //             ISO3: 'ARA',
    //             direction: 'rtl',
    //             country: 'UNITED ARAB EMIRATES',
    //             country_code: null,
    //             active: '1'
    //         }
    //     ],
    //     currencies: [
    //         {
    //             country_id: '145',
    //             country_name: 'Saudi Arabia',
    //             country_code: 'SA',
    //             currency: 'SAR',
    //             currency_name: 'Saudi riyal',
    //             mcc: '966',
    //             countryType: 'Asia',
    //             active: '1'
    //         },
    //         {
    //             country_id: '180',
    //             country_name: 'United Arab Emirates',
    //             country_code: 'AE',
    //             currency: 'AED',
    //             currency_name: 'UAE dirham',
    //             mcc: '971',
    //             countryType: 'Asia',
    //             active: '1'
    //         },
    //         {
    //             country_id: '181',
    //             country_name: 'United Kingdom',
    //             country_code: 'GB',
    //             currency: 'GBP',
    //             currency_name: 'British pound',
    //             mcc: '44',
    //             countryType: 'Europe',
    //             active: '1'
    //         },
    //         {
    //             country_id: '182',
    //             country_name: 'United States',
    //             country_code: 'US',
    //             currency: 'USD',
    //             currency_name: 'United State Dollor',
    //             mcc: '1',
    //             countryType: 'North America',
    //             active: '1'
    //         }
    //     ],
    //     payment_gateways: [
    //         {
    //             id: '3',
    //             name: 'TABBY',
    //             bank: null,
    //             account_no: null,
    //             is_active: '1',
    //             created_at: '2024-02-13 11:22:49',
    //             updated_at: '2024-02-13 11:22:49'
    //         },
    //         {
    //             id: '8',
    //             name: 'CRYPTADIUM',
    //             bank: null,
    //             account_no: null,
    //             is_active: '1',
    //             created_at: '2024-11-24 04:44:50',
    //             updated_at: '2024-11-24 04:44:50'
    //         },
    //         {
    //             id: '10',
    //             name: 'TELR',
    //             bank: null,
    //             account_no: null,
    //             is_active: '1',
    //             created_at: '2025-11-10 06:06:05',
    //             updated_at: '2025-11-10 06:06:05'
    //         }
    //     ],
    //     cards_accepted: [
    //         {
    //             id: '1',
    //             card_name: 'VISA',
    //             image: 'card-visa.svg',
    //             is_active: '1',
    //             created_at: '2024-02-13 11:23:51',
    //             updated_at: '2024-02-13 13:21:49'
    //         },
    //         {
    //             id: '2',
    //             card_name: 'MASTERCARD',
    //             image: 'card-mastercard.svg',
    //             is_active: '1',
    //             created_at: '2024-02-13 11:24:31',
    //             updated_at: '2024-02-13 13:21:57'
    //         }
    //     ],
    //     social_media: [
    //         {
    //             id: '1',
    //             name: 'FACEBOOK',
    //             url: 'https://www.facebook.com/Asfartrip/',
    //             icon: 'icon-facebook',
    //             is_active: '1',
    //             created_at: '2024-02-13 13:30:10',
    //             updated_at: '2024-02-13 13:34:21'
    //         },
    //         {
    //             id: '2',
    //             name: 'TWITTER',
    //             url: 'https://twitter.com/asfartrip_uae',
    //             icon: 'icon-twitter',
    //             is_active: '1',
    //             created_at: '2024-02-13 13:31:06',
    //             updated_at: '2024-02-13 13:34:55'
    //         },
    //         {
    //             id: '3',
    //             name: 'INSTAGRAM',
    //             url: 'https://www.instagram.com/asfartrip_official/',
    //             icon: 'icon-instagram',
    //             is_active: '1',
    //             created_at: '2024-02-13 13:31:06',
    //             updated_at: '2024-02-13 13:34:35'
    //         }
    //     ],
    //     module_privileges: ['Hotel', 'Flight', 'Car', 'Insurance', 'Holiday', 'Activity']
    // }





    return (
        <html lang={locale} dir={isRTL ? "rtl" : "ltr"} suppressHydrationWarning>
            <body className={`${cairo.className} antialiased`}>
                <ClientLayout locale={locale} messages={messages} config={config}>
                    {children}
                </ClientLayout>
            </body>
        </html>
    );
}
