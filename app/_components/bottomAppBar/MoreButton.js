import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
    BanknotesIcon,
    DocumentCheckIcon,
    DocumentTextIcon,
    ExclamationCircleIcon,
    PhoneIcon,
    QuestionMarkCircleIcon,
    SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import LanguageSwitcher from "../LanguageSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";
import CurrencySwicther from "../CurrencySwicther";
import ChevronBasedOnLanguage from "../ui/ChevronBasedOnLanguage";
import SignOutButton from "../loginButton/SignOut";
import { Earth } from "lucide-react";

const HELPER_LINKS = [
    {
        title: "about_us",
        icon: <ExclamationCircleIcon className="size-5 text-accent-500" />,
        path: "/about-us",
    },
    {
        title: "contact_us",
        icon: <PhoneIcon className="text-accent-500" />,
        path: "/contact-us",
    },
    {
        title: "privacy_policy",
        icon: <DocumentCheckIcon className="size-5 text-accent-500" />,
        path: "/privacy_policy",
    },
    {
        title: "terms_conditions",
        icon: <DocumentTextIcon className="size-5 text-accent-500" />,
        path: "/terms_condition",
    },
    {
        title: "faqs",
        icon: <QuestionMarkCircleIcon className="size-5 text-accent-500" />,
        path: "/faqs",
    },
];

function MoreButton() {
    const t = useTranslations("Homepage");
    const p = useTranslations("Pages");
    const { theme, setTheme } = useTheme();
    const condition = theme === "dark";
    function handleSwitch() {
        setTheme(condition ? "light" : "dark");
    }
    return (
        <Dialog>
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
                    <DialogTitle className="shadow-lg w-full pb-5 capitalize">
                        {t("more")}
                    </DialogTitle>
                    <DialogDescription>
                        <section className=" dark:bg-gray-[#555]  mt-2 mx-3 rounded-lg min-h-80 pt-2 flex flex-col  px-4 shadow-xl  ">
                            {/* Language Switcher */}
                            <div className="flex items-center border-b-1 border-gray-300 pb-1  dark:border-gray-100">
                                <Earth className="size-5 w-5 h-5 text-accent-500" />
                                <div className=" w-full">
                                    <LanguageSwitcher />
                                </div>
                            </div>
                            {/* Theme Switcher */}
                            <div className="py-2 flex text-md font-bold items-center border-b-1 border-gray-300 dark:border-gray-100 justify-between bac">
                                <ThemeSwitcher />
                                <Switch
                                    checked={condition}
                                    onCheckedChange={handleSwitch}
                                    dir="ltr"
                                />
                            </div>
                            {/* Currency Switcher */}
                            <div className="py-2 flex items-center border-b-1 border-gray-300 pb-1  dark:border-gray-100 gap-3">
                                <BanknotesIcon className="size-5 text-accent-500" />
                                <div className=" w-full">
                                    <CurrencySwicther isLabel={false} />
                                </div>
                                <span className="font-bold dark:text-gray-50">
                                    <ChevronBasedOnLanguage />
                                </span>
                            </div>

                            {/* Helper Links */}
                            {HELPER_LINKS.map((link, index) => (
                                <Link
                                    key={link.title}
                                    className={`flex  py-3 border-b-1  w-full justify-between dark:text-gray-50  ${
                                        index + 1 < HELPER_LINKS.length
                                            ? "border-gray-300 dark:border-gray-100 "
                                            : ""
                                    }`}
                                    href={link.path}
                                >
                                    <div className="flex gap-2 capitalize font-bold">
                                        <span className="w-5 ">
                                            {link.icon}
                                        </span>
                                        {p(`${link.title}`)}
                                    </div>
                                    <ChevronBasedOnLanguage />
                                </Link>
                            ))}
                        </section>
                    </DialogDescription>
                </DialogHeader>
                {/* Sign out  */}
                <DialogFooter className="flex items-center">
                    <SignOutButton />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default MoreButton;
