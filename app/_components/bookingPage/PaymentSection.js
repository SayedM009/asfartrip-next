import React, { useState } from "react";
import { CreditCard, Wallet, Bitcoin, Check } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PaymentSection({
    totalAmount,
    currency,
    onConfirmPayment,
}) {
    const [selectedMethod, setSelectedMethod] = useState("card");
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");

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
        },
        {
            id: "tamara",
            name: "Tamara",
            icon: Wallet,
            description: "Buy now, pay later",
            color: "purple",
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
        <div className="space-y-6">
            {/* Payment Method Selection */}
            <div>
                <h2 className="mb-4 rtl:text-right">Select Payment Method</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        const isSelected = selectedMethod === method.id;
                        return (
                            <button
                                key={method.id}
                                onClick={() => setSelectedMethod(method.id)}
                                className={cn(
                                    "p-6 rounded-lg border-2 transition-all text-left rtl:text-right",
                                    isSelected
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/50"
                                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                                )}
                            >
                                <div className="flex items-start gap-4 rtl:flex-row-reverse">
                                    <div
                                        className={cn(
                                            "p-3 rounded-lg shrink-0",
                                            method.color === "blue" &&
                                                "bg-blue-100 dark:bg-blue-900",
                                            method.color === "green" &&
                                                "bg-green-100 dark:bg-green-900",
                                            method.color === "purple" &&
                                                "bg-purple-100 dark:bg-purple-900",
                                            method.color === "orange" &&
                                                "bg-orange-100 dark:bg-orange-900"
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                "w-6 h-6",
                                                method.color === "blue" &&
                                                    "text-blue-600 dark:text-blue-400",
                                                method.color === "green" &&
                                                    "text-green-600 dark:text-green-400",
                                                method.color === "purple" &&
                                                    "text-purple-600 dark:text-purple-400",
                                                method.color === "orange" &&
                                                    "text-orange-600 dark:text-orange-400"
                                            )}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1 rtl:flex-row-reverse rtl:justify-end">
                                            <h4>{method.name}</h4>
                                            {isSelected && (
                                                <Check className="w-5 h-5 text-blue-600" />
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {method.description}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Payment Details Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-border p-6">
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
            </div>

            {/* Confirm Payment Button */}
            <Button
                onClick={onConfirmPayment}
                className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg"
                size="lg"
            >
                Confirm Payment • {currency} {totalAmount.toFixed(2)}
            </Button>
        </div>
    );
}
