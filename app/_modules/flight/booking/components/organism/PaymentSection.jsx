import { use, useState } from "react";
import { CreditCard, Wallet, Bitcoin, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTranslations } from "next-intl";
import useBookingStore from "../../store/bookingStore";
import TimeoutPopup from "@/app/_components/ui/TimeoutPopup";
import FareSummaryDialog from "./FareSummaryDialog";
import { useCurrency } from "@/app/_modules/currency/hooks/useCurrency";
import { BackWardButtonWithDirections } from "@/app/_components/layout/BackwardButton";
import LoyaltyPointsBanner from "@/app/_modules/loyalty/components/organisms/LoyaltyPointsBanner";
import PayWithLoyaltyPoints from "@/app/_modules/loyalty/components/organisms/PayWithLoyaltyPoints";
import { WebsiteConfigContext } from "@/app/_modules/config";

import TopMobileSection from "./TopMobileSection";
import BookingPagePaymentTitle from "../atoms/BookingPagePaymentTitle";
import BookingPagePaymentSubTitle from "../atoms/BookingPagePaymentSubTitle";
import CardsAccepted from "@/app/_components/layout/footer/CardsAccepted";

export default function PaymentSection({
    onConfirmPayment,
    backTo,
    loading,
    iframeSrc,
}) {
    const [selectedMethod, setSelectedMethod] = useState("card");

    const { payment_gateways } = use(WebsiteConfigContext);

    const supportedGateways = payment_gateways.map((p) => p.name.toLowerCase());

    const { ticket, searchURL, getTotalPrice } = useBookingStore();
    const totalAmount = getTotalPrice();
    const p = useTranslations("Payment");
    const t = useTranslations("Flight");

    const paymentMethods = [
        {
            id: "card",
            name: "telr",
            icon: CreditCard,
            description: "Pay securely with telr",
            color: "green",
        },
        {
            id: "card",
            name: "ziina",
            icon: CreditCard,
            description: "Pay securely with ziina",
            color: "purple",
        },
        {
            id: "tabby",
            name: "tabby",
            icon: Wallet,
            description: "Split into 4 payments",
            color: "green",
            img: "/currencies/tabby.svg",
        },
        {
            id: "tamara",
            name: "tamara",
            icon: Wallet,
            description: "Buy now, pay later",
            color: "purple",
            img: "/currencies/tamara.jpg",
            class: "rounded-full",
            width: 30,
            height: 30,
        },
        {
            id: "crypto",
            name: "cryptadium",
            icon: Bitcoin,
            description: "Pay with Bitcoin or other crypto",
            color: "orange",
        },
    ];

    return (
        <div className="space-y-6 flex-1 mt-1">
            {/* Payment Method Selection */}
            <div className="space-y-4 mt-15 sm:mt-auto">
                <div className="items-center gap-4 mb-4 hidden sm:flex">
                    <BackWardButtonWithDirections onClick={backTo} />
                    <BookingPagePaymentTitle t={p} />
                </div>
                <TopMobileSection t={t} ticket={ticket}>
                    <div className="flex items-center gap-4">
                        <BackWardButtonWithDirections onClick={backTo} />
                        <div>
                            <BookingPagePaymentTitle t={p} />
                            <BookingPagePaymentSubTitle t={p} />
                        </div>
                    </div>
                </TopMobileSection>
                {/* Loyalty Points Banner */}
                <LoyaltyPointsBanner price={totalAmount} />

                {/* Pay with Loyalty  Points */}
                <PayWithLoyaltyPoints />
            </div>

            <GateWays
                paymentMethods={paymentMethods}
                selectedMethod={selectedMethod}
                setSelectedMethod={setSelectedMethod}
                supportedGateways={supportedGateways}
                t={p}
            />

            {/* Payment Details Form */}
            {selectedMethod === "card" &&
                supportedGateways.includes("telr") && (
                    <TelrIframe src={iframeSrc} />
                )}
            {/* Confirm Payment Button */}
            <PaymentButton
                onConfirmPayment={onConfirmPayment}
                loading={loading}
                isTelrCard={
                    selectedMethod === "card" &&
                    supportedGateways.includes("telr")
                }
            />

            <TimeoutPopup timeoutMinutes={12} redirectLink={searchURL} />
        </div>
    );
}

function PaymentButton({ onConfirmPayment, loading, isTelrCard }) {
    const { getTotalPrice } = useBookingStore();
    const totalAmount = getTotalPrice();
    const { formatPrice } = useCurrency();
    const p = useTranslations("Payment");
    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 right-0 sm:relative bg-white dark:bg-gray-800 border-t border-border shadow-lg z-50 ",
                isTelrCard && "block md:hidden"
            )}
        >
            <div className="p-3">
                <div className="sm:hidden">
                    <FareSummaryDialog />
                </div>
                {!isTelrCard && (
                    <Button
                        onClick={onConfirmPayment}
                        className={cn(
                            `py-5 sm:py-7 sm:text-lg font-semibold
                    bg-gradient-to-r from-primary-700 to-accent-400
                    hover:from-primary-600 hover:to-accent-500
                    text-white shadow-md hover:shadow-lg
                     duration-300 cursor-pointer rounded-sm w-full transition-colors gap-4  `
                        )}
                        size="lg"
                        disabled={loading}
                    >
                        <span>
                            {loading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                p("pay_now")
                            )}
                        </span>
                        {formatPrice(totalAmount, "white")}
                    </Button>
                )}
            </div>
        </div>
    );
}

function TelrIframe({ src }) {
    const p = useTranslations("Payment");
    if (!src) return null;
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-border p-4 min-h-6 mb-16">
            <h3 className="mb-6 pb-4 border-b border-border rtl:text-right">
                {p("card")}
            </h3>

            <iframe
                src={src}
                width="100%"
                height="300px"
                style={{
                    border: "none",
                    borderRadius: "0",
                    margin: "0",
                }}
            ></iframe>
        </div>
    );
}

function GateWays({
    paymentMethods,
    selectedMethod,
    setSelectedMethod,
    supportedGateways,
    t,
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 sm:mt-auto">
            {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;
                if (!supportedGateways.includes(method.name)) return null;
                return (
                    <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={cn(
                            "p-2 rounded-lg border-2 transition-all text-left rtl:text-right",
                            isSelected
                                ? "border-accent-500 bg-accent-50 dark:bg-blue-950/50"
                                : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                        )}
                    >
                        <div className="flex items-center gap-4 ">
                            <div
                                className={cn(
                                    "p-2 rounded-lg shrink-0",
                                    method.color === "blue" &&
                                        "bg-accent-100 dark:bg-accent-900",
                                    method.color === "green" &&
                                        "bg-green-100 dark:bg-green-900",
                                    method.color === "purple" &&
                                        "bg-purple-100 dark:bg-purple-900",
                                    method.color === "orange" &&
                                        "bg-orange-100 dark:bg-orange-900"
                                )}
                            >
                                {method.img ? (
                                    <Image
                                        src={method.img}
                                        alt={` payment with ${method.id}`}
                                        className={method.class}
                                        width={method.width || 40}
                                        height={method.height || 40}
                                        quality={100}
                                    />
                                ) : (
                                    <Icon
                                        className={cn(
                                            "w-6 h-6",
                                            method.color === "blue" &&
                                                "text-accent-600 dark:text-accent-400",
                                            method.color === "green" &&
                                                "text-green-600 dark:text-green-400",
                                            method.color === "purple" &&
                                                "text-purple-600 dark:text-purple-400",
                                            method.color === "orange" &&
                                                "text-orange-600 dark:text-orange-400"
                                        )}
                                    />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-0 ">
                                    <h4 className="font-semibold">
                                        {t(`${method.id}`)}
                                    </h4>
                                    {isSelected && (
                                        <Check className="w-5 h-5 text-accent-600" />
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {method.id === "card" ? (
                                        <div className="flex items-center gap-2">
                                            <CardsAccepted />
                                        </div>
                                    ) : (
                                        t(`${method.id}_description`)
                                    )}
                                </p>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
