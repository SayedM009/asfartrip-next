"use client";
import { useRouter } from "next/navigation";
import { cloneElement } from "react";

export default function BackwardButton({ children }) {
    const router = useRouter();
    function goBack() {
        router.push("/");
    }
    return cloneElement(children, {
        onClick: (e) => {
            if (children.props.onClick) children.props.onClick(e);
            goBack();
        },
    });
}
