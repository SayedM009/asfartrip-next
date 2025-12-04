import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    // DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
    BanknotesIcon,
    PhoneIcon,
    QuestionMarkCircleIcon,
    SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import CurrencySwitcher from "@/app/_modules/currency/components/organisms/CurrencySwitcher";
import ChevronBasedOnLanguage from "../../ui/ChevronBasedOnLanguage";
import {
    Ban,
    Earth,
    FileText,
    RotateCcw,
    ShieldCheck,
    User,
} from "lucide-react";
import { useState } from "react";
import { LanguageSwitcher } from "@/app/_modules/language";
import { ThemeSwitcher } from "@/app/_modules/theme";
import clsx from "clsx";
// import { SignOutButton } from "@/app/_modules/auth";

const HELPER_LINKS = [
    {
        title: "about_us",
        icon: <User className="size-5 text-accent-500" />,
        path: "/about-us",
    },
    {
        title: "contact_us",
        icon: <PhoneIcon className="text-accent-500" />,
        path: "/contact-us",
    },
    {
        title: "faqs",
        icon: <QuestionMarkCircleIcon className="size-5 text-accent-500" />,
        path: "/faqs",
    },
    {
        title: "terms_conditions",
        icon: <FileText className="size-5 text-accent-500" />,
        path: "/terms-and-conditions",
    },
    {
        title: "privacy_policy",
        icon: <ShieldCheck className="size-5 text-accent-500" />,
        path: "/privacy-policy",
    },
    {
        title: "cancellation_policy",
        icon: <Ban className="size-5 text-accent-500" />,
        path: "/cancellation-policy",
    },
    {
        title: "refund_policy",
        icon: <RotateCcw className="size-5 text-accent-500" />,
        path: "/refund-policy",
    },
];

function MoreButton() {
    const [open, setOpen] = useState(false);
    const t = useTranslations("Homepage");
    const p = useTranslations("Pages");
    const { theme, setTheme } = useTheme();
    const condition = theme === "dark";
    function handleSwitch() {
        setTheme(condition ? "light" : "dark");
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                {/* Dialog Trigger */}
                <div className="  pt-2 pb-0.5  flex flex-col items-center">
                    <SquaresPlusIcon className="w-6 " />
                    <span className="text-[11px] font-bold capitalize ">
                        {t("more")}
                    </span>
                </div>
            </DialogTrigger>
            <DialogContent
                className={cn(
                    " bg-background  pt-4 px-0",
                    "max-w-none w-full h-full rounded-none border-0  md:h-11/12 md:rounded",
                    "open-slide-left",
                    "close-slide-left"
                )}
            >
                <DialogHeader>
                    {/* Dialog Title */}
                    <DialogTitle className="shadow-lg w-full pb-5 capitalize text-center">
                        {t("more")}
                    </DialogTitle>
                    <DialogDescription>
                        <section className=" dark:bg-gray-[#555]  mt-2 mx-3 rounded-lg min-h-80  flex flex-col  px-4 shadow-xl gap-2 ">
                            {/* Currency Switcher */}
                            <div className=" flex items-center justify-between border-b-1 border-gray-300   dark:border-gray-100 gap-3 pb-2">
                                <BanknotesIcon className="size-5 text-accent-500" />
                                <div className="w-full">
                                    <CurrencySwitcher isLabel={false} />
                                </div>
                            </div>
                            {/* Language Switcher */}
                            <div className="flex items-center border-b-1 border-gray-300   dark:border-gray-100 pb-2">
                                <Earth className="size-5 w-5 h-5 text-accent-500" />
                                <div className=" w-full">
                                    <LanguageSwitcher />
                                </div>
                            </div>

                            {/* Theme Switcher */}
                            <div className=" flex text-md font-bold items-center border-b-1 border-gray-300 dark:border-gray-100 justify-between pb-2">
                                <ThemeSwitcher />
                                <Switch
                                    checked={condition}
                                    onCheckedChange={handleSwitch}
                                    dir="ltr"
                                />
                            </div>


                            {/* Helper Links */}
                            {HELPER_LINKS.map((link, index) => (
                                <Link
                                    key={link.title}
                                    href={link.path}
                                    onClick={() => setOpen(false)}
                                    className={clsx(
                                        "flex  w-full justify-between dark:text-gray-50 pt-2 pb-4",
                                        "capitalize font-bold",
                                        index !== HELPER_LINKS.length - 1 && "border-b border-gray-300 dark:border-gray-100"
                                    )}
                                >
                                    <div className="flex gap-2">
                                        <span className="w-5">{link.icon}</span>
                                        {p(link.title)}
                                    </div>

                                    <ChevronBasedOnLanguage size={12} />
                                </Link>
                            ))}
                        </section>
                    </DialogDescription>
                </DialogHeader>
                {/* Sign out  */}
                {/* <DialogFooter className="flex items-center">
                    <SignOutButton />
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
    );
}

export default MoreButton;
