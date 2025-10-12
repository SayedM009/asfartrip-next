"use client";
import useCheckLocal from "@/app/_hooks/useCheckLocal";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { cloneElement } from "react";

export default function BackwardButton({ children }) {
    const router = useRouter();
    function goBack() {
        router.back();
    }
    return cloneElement(children, {
        onClick: (e) => {
            if (children.props.onClick) children.props.onClick(e);
            goBack();
        },
    });
}

export function BackWardButtonWithDirections() {
    const { isRTL } = useCheckLocal();
    return (
        <BackwardButton>
            <Button className="p-0 bg-accent-100 ">
                {isRTL ? (
                    <ChevronRight className="size-5  font-bold text-accent-700" />
                ) : (
                    <ChevronLeft className="size-5  font-bold text-accent-700" />
                )}
            </Button>
        </BackwardButton>
    );
}
