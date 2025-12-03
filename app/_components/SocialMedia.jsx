"use cleint";
import { Instagram, Facebook } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { useContext } from "react";
// import { WebsiteConfigContext } from "../_modules/config";
import XIcon from "./SVG/XIcon";
import WhatsAppIcon from "./SVG/WhatsAppIcon";
import TikTokIcon from "./SVG/TikTokIcon";

function SocialMedia({
    options = {
        sizeIcon: 12,
        align: "center",
        sizeOnMobile: 12,
        sizeOnTablet: 12,
        sizeOnDesktop: 12,
    },
}) {
    // const {social_media} = useContext(WebsiteConfigContext)

    const c = useTranslations("ContactPage");
    const socialLinks = {
        INSTAGRAM: {
            icon: Instagram,
            name: c("social_instagram"),
            ariaLabel: c("social_instagram"),
        },
        FACEBOOK: {
            icon: Facebook,
            name: c("social_facebook"),
            ariaLabel: c("social_facebook"),
        },
        TIKTOK: {
            icon: TikTokIcon,
            name: c("social_tiktok"),
            ariaLabel: c("social_tiktok"),
        },
        TWITTER: {
            icon: XIcon,
            name: c("social_twitter"),
            ariaLabel: c("social_twitter"),
        },

        WHATSAPP: {
            icon: WhatsAppIcon,
            name: c("social_whatsapp"),
            ariaLabel: c("social_whatsapp"),
        },
    };
    return (
        <div
            className={`flex items-center justify-${options.align} gap-4 lg:gap-6`}
        >
            {/* {social_media.map((social, index) => {
                            const Icon = socialLinks[social.name].icon;

                            return (
                                <motion.a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.ariaLabel}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: 0.3 + index * 0.1,
                                    }}
                                    className={`w-${options.sizeOnMobile} h-${options.sizeOnMobile} lg:w-${options.sizeOnDesktop} lg:h-${options.sizeOnDesktop} rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center hover:bg-accent-500 dark:hover:bg-accent-500 hover:scale-110 transition-all duration-300 group`}
                                >
                                    <Icon  className={` text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-300`}    />
                                </motion.a>
                            );
                        })} */}
        </div>
    );
}

export default SocialMedia;
