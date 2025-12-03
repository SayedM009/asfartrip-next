// "use client";

// import { ThemeProvider } from "next-themes";
// import { NextIntlClientProvider } from "next-intl";
// import { AuthProvider } from "./providers";
// import { Toaster } from "@/components/ui/sonner";
// import { AlertCircle } from "lucide-react";
// import { CheckCircleIcon } from "@heroicons/react/24/solid";
// import { WebsiteConfigProvider } from "../_modules/config";

// export default function ClientLayout({ children, locale, messages, config }) {
//     return (
//         <AuthProvider>
//             <WebsiteConfigProvider config={config}>
//                 <NextIntlClientProvider locale={locale} messages={messages}>
//                     <ThemeProvider attribute="class" enableSystem defaultTheme="light">
//                         <main>{children}</main>

//                         <Toaster
//                             position="top-center"
//                             duration={2000}
//                             icons={{
//                                 success: <CheckCircleIcon className="text-green-500 size-5" />,
//                                 error: (
//                                     <AlertCircle className="rounded-full size-5 bg-red-500 text-white" />
//                                 ),
//                             }}
//                         />
//                     </ThemeProvider>
//                 </NextIntlClientProvider>
//             </WebsiteConfigProvider>
//         </AuthProvider>
//     );
// }
