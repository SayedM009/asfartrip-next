"use client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
function NoInsurancePlans() {
    const t = useTranslations("Insurance.results");
    return (
        <Card className="shadow-none border-0 bg-transparent capitalize">
            <CardContent className="flex items-center justify-center py-12 flex-col">
                <div className="text-center">
                    <div className="relative flex justify-center">
                        <Image
                            src="/not-found/no-flights.webp"
                            alt="no-insurance-plans"
                            className="object-cover"
                            width={500}
                            height={500}
                        />
                    </div>

                    <h1 className="text-xl mb-2 mt-7 text-gray-950 font-semibold capitalize">
                        {t("no_insurance_plans")}
                    </h1>

                    <p className="text-md text-muted-foreground mb-2 capitalize">
                        {t("we_could_not_find_any_insurance_plans")}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default NoInsurancePlans;
