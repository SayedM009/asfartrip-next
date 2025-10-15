"use client";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cloneElement } from "react";

export default function BackwardButton({ children, onClick }) {
    const router = useRouter();

    function goBack() {
        router.back();
    }

    return cloneElement(children, {
        onClick: (e) => {
            // إذا تم تمرير onClick من الخارج → استخدمه فقط
            if (onClick) {
                onClick(e);
            } else {
                goBack();
            }
        },
    });
}

export function BackWardButtonWithDirections({ onClick }) {
    const { isRTL } = useCheckLocal();

    return (
        <BackwardButton onClick={onClick}>
            <Button className="p-0 bg-accent-100 hover:bg-accent-200 cursor-pointer">
                {isRTL ? (
                    <ChevronRight className="size-5 font-bold text-accent-700 " />
                ) : (
                    <ChevronLeft className="size-5 font-bold text-accent-700 " />
                )}
            </Button>
        </BackwardButton>
    );
}
