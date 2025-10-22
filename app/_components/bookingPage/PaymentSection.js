import React, { useState } from "react";
import { CreditCard, Wallet, Bitcoin, Check, Loader2 } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BackWardButtonWithDirections } from "../flightSearchNavWrapper/BackwardButton";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/app/_context/CurrencyContext";
import TopMobileSection from "./TopMobileSection";

export default function PaymentSection({
    totalAmount,
    currency,
    onConfirmPayment,
    backTo,
    ticket,
    loading,
}) {
    const [selectedMethod, setSelectedMethod] = useState("card");
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const { formatPrice } = useCurrency();
    const p = useTranslations("Payment");

    const paymentMethods = [
        {
            id: "card",
            name: "Credit/Debit Card",
            icon: CreditCard,
            description: "Pay securely with your card",
            color: "blue",
        },
        {
            id: "tabby",
            name: "Tabby",
            icon: Wallet,
            description: "Split into 4 payments",
            color: "green",
            img: "/currencies/tabby.svg",
        },
        {
            id: "tamara",
            name: "Tamara",
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
            name: "Cryptocurrency",
            icon: Bitcoin,
            description: "Pay with Bitcoin or other crypto",
            color: "orange",
        },
    ];

    const formatCardNumber = (value) => {
        const cleaned = value.replace(/\s/g, "");
        const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
        return formatted;
    };

    const handleCardNumberChange = (e) => {
        const value = e.target.value.replace(/\s/g, "");
        if (value.length <= 16) {
            setCardNumber(value);
        }
    };

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length >= 2) {
            value = value.slice(0, 2) + "/" + value.slice(2, 4);
        }
        if (value.length <= 5) {
            setExpiryDate(value);
        }
    };

    const handleCvvChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length <= 3) {
            setCvv(value);
        }
    };

    return (
        <div className="space-y-6 flex-1">
            {/* Payment Method Selection */}
            <div>
                <div className="flex items-center gap-4 mb-4 ">
                    <BackWardButtonWithDirections onClick={backTo} />
                    <h2 className=" capitalize  font-semibold text-xl">
                        {p("select_payment_method")}
                    </h2>
                    <div></div>
                </div>
                <TopMobileSection ticket={ticket}>
                    <div className="flex items-center gap-4">
                        <BackWardButtonWithDirections onClick={backTo} />
                        <div>
                            <h2 className="text-lg font-semibold capitalize ">
                                {p("select_payment_method")}
                            </h2>
                            <div className="capitalize flex items-center gap-2 text-xs text-muted-foreground truncate">
                                <span>{p("secured_payments")}</span>
                            </div>
                        </div>
                    </div>
                </TopMobileSection>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 sm:mt-auto">
                    {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        const isSelected = selectedMethod === method.id;
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
                                                {p(`${method.id}`)}
                                            </h4>
                                            {isSelected && (
                                                <Check className="w-5 h-5 text-accent-600" />
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {method.id === "card" ? (
                                                <div className="flex items-center gap-2">
                                                    <Image
                                                        src="/currencies/visa.svg"
                                                        alt="card payment with visa"
                                                        width={30}
                                                        height={30}
                                                        quality={100}
                                                    />
                                                    <Image
                                                        src="/currencies/mastercard.svg"
                                                        alt="card payment with mastercard"
                                                        width={30}
                                                        height={30}
                                                        quality={100}
                                                    />
                                                    <Image
                                                        src="/currencies/ziina.jpg"
                                                        alt="card payment with ziina"
                                                        className="rounded-full"
                                                        width={20}
                                                        height={20}
                                                        quality={100}
                                                    />
                                                </div>
                                            ) : (
                                                p(`${method.id}_description`)
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Payment Details Form */}
            {/* <div className="bg-white dark:bg-gray-800 rounded-lg border border-border p-6">
                <h3 className="mb-6 pb-4 border-b border-border rtl:text-right">
                    Payment Details
                </h3>

                {selectedMethod === "card" && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                value={formatCardNumber(cardNumber)}
                                onChange={handleCardNumberChange}
                                className="h-12 font-mono"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cardName">Cardholder Name</Label>
                            <Input
                                id="cardName"
                                placeholder="JOHN SMITH"
                                value={cardName}
                                onChange={(e) =>
                                    setCardName(e.target.value.toUpperCase())
                                }
                                className="h-12"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input
                                    id="expiry"
                                    placeholder="MM/YY"
                                    value={expiryDate}
                                    onChange={handleExpiryChange}
                                    className="h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvv">CVV</Label>
                                <Input
                                    id="cvv"
                                    type="password"
                                    placeholder="123"
                                    value={cvv}
                                    onChange={handleCvvChange}
                                    className="h-12"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {selectedMethod === "tabby" && (
                    <div className="text-center py-8">
                        <div className="bg-green-50 dark:bg-green-950 p-6 rounded-lg inline-block">
                            <Wallet className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                            <h4 className="mb-2">Pay in 4 installments</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                                {currency} {(totalAmount / 4).toFixed(2)} every
                                2 weeks
                            </p>
                            <p className="text-xs text-muted-foreground">
                                No interest, no fees
                            </p>
                        </div>
                    </div>
                )}

                {selectedMethod === "tamara" && (
                    <div className="text-center py-8">
                        <div className="bg-purple-50 dark:bg-purple-950 p-6 rounded-lg inline-block">
                            <Wallet className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                            <h4 className="mb-2">Split into 3 payments</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                                {currency} {(totalAmount / 3).toFixed(2)} per
                                month
                            </p>
                            <p className="text-xs text-muted-foreground">
                                0% interest
                            </p>
                        </div>
                    </div>
                )}

                {selectedMethod === "crypto" && (
                    <div className="text-center py-8">
                        <div className="bg-orange-50 dark:bg-orange-950 p-6 rounded-lg inline-block">
                            <Bitcoin className="w-12 h-12 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
                            <h4 className="mb-2">Pay with Cryptocurrency</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                                Bitcoin, Ethereum, USDT accepted
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Instant confirmation
                            </p>
                        </div>
                    </div>
                )}
            </div> */}

            {/* Confirm Payment Button */}
            <Button
                onClick={onConfirmPayment}
                className="py-7 text-lg font-semibold
                    bg-gradient-to-r from-primary-700 to-accent-400
                    hover:from-primary-600 hover:to-accent-500
                    text-white shadow-md hover:shadow-lg
                     duration-300 cursor-pointer rounded-sm w-full transition-colors gap-4"
                size="lg"
                disabled={loading} // أضف prop للتحميل
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
        </div>
    );
}
