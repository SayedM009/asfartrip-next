"use client";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cloneElement } from "react";

export default function BackwardButton({ children, onClick, href }) {
    const router = useRouter();

    function handleClick(e) {
        if (onClick) {
            onClick(e);
        } else if (href) {
            router.push(href);
        } else {
            router.back();
        }
    }

    return cloneElement(children, {
        onClick: handleClick,
    });
}

export function BackWardButtonWithDirections({ onClick, href }) {
    const { isRTL } = useCheckLocal();

    return (
        <BackwardButton onClick={onClick} href={href}>
            <Button className="p-0 bg-accent-100 hover:bg-accent-200 cursor-pointer">
                {isRTL ? (
                    <ChevronRight className="size-5 font-bold text-accent-700" />
                ) : (
                    <ChevronLeft className="size-5 font-bold text-accent-700" />
                )}
            </Button>
        </BackwardButton>
    );
}
