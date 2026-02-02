"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Description({ html }) {
    const [dialogOpen, setDialogOpen] = useState(false);

    if (!html) return null;

    // استخراج أول فقرة فقط للعرض المختصر
    const getFirstParagraph = (htmlContent) => {
        // نستخرج أول <p>...</p>
        const match = htmlContent.match(/<p>(.*?)<\/p>/is);
        if (match) {
            return match[0]; // أول فقرة كاملة مع الـ tags
        }
        // لو مفيش فقرات، ناخد أول 300 حرف
        const plainText = htmlContent.replace(/<[^>]+>/g, "");
        return (
            plainText.substring(0, 300) + (plainText.length > 300 ? "..." : "")
        );
    };

    const firstParagraph = getFirstParagraph(html);

    // نشيل الـ Disclaimer من النص الكامل
    const cleanHtml = html.replace(/<b>Disclaimer.*?<\/b>/gi, "");

    return (
        <section>
            <h2 className="text-xl font-bold mb-4">Description</h2>

            {/* أول فقرة */}
            <div
                className="prose prose-sm max-w-none text-muted-foreground line-clamp-4"
                dangerouslySetInnerHTML={{ __html: firstParagraph }}
            />

            {/* زر Show More */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        className="px-0 hover:bg-transparent cursor-pointer text-blue-500 dark:hover:bg-transparent mt-2"
                    >
                        Show More
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-full md:max-h-[80vh] rounded-none md:rounded-lg">
                    <DialogHeader className="ltr:text-left rtl:text-right">
                        <DialogTitle>Full Description</DialogTitle>
                    </DialogHeader>
                    <div className="overflow-y-auto h-full md:max-h-[60vh] pr-2">
                        <div
                            className="prose prose-sm max-w-none text-muted-foreground 
                                [&_b]:text-foreground [&_b]:font-semibold
                                [&_p]:mb-4"
                            dangerouslySetInnerHTML={{ __html: cleanHtml }}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}
