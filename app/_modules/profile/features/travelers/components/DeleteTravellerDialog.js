"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDeleteTraveller } from "@/app/_hooks/useDeleteTraveller";

export default function DeleteTravellerDialog({ traveller, userId }) {
    const p = useTranslations("Profile");
    const { handleDeleteTraveller } = useDeleteTraveller();
    const { first_name, last_name } = JSON.parse(traveller.json_list);

    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const travellerName = `${first_name} ${last_name}`;

    const handleDeleteClick = async () => {
        try {
            setIsDeleting(true);
            await handleDeleteTraveller(
                traveller.id,
                userId,
                () => setOpen(false),
                travellerName
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="transition-colors">
                    <Trash className="size-5 text-red-500 hover:text-red-600 cursor-pointer" />
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-sm p-6 rounded-2xl bg-white dark:bg-[#1e1e20] border border-gray-100 dark:border-neutral-800 text-center shadow-xl data-[state=open]:animate-[scaleUp_0.3s_ease-out]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-red-500">
                        {p("delete_traveller")}
                    </DialogTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {p("delete_traveller_confirmation", {
                            traveller: travellerName,
                        })}
                    </p>
                </DialogHeader>

                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isDeleting}
                    >
                        {p("cancel")}
                    </Button>

                    <Button
                        className="bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
                        onClick={handleDeleteClick}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <span className="size-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                            p("delete")
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// import { useDeleteTraveller } from "@/app/_hooks/useDeleteTraveller";
// import { Button } from "@/components/ui/button";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog";
// import { Trash } from "lucide-react";
// import { useTranslations } from "next-intl";

// export default function DeleteTravellerDialog({ traveller, userId }) {
//     const p = useTranslations("Profile");
//     const { handleDeleteTraveller } = useDeleteTraveller();
//     const { first_name, last_name } = JSON.parse(traveller.json_list);
//     return (
//         <Dialog>
//             <DialogTrigger>
//                 <button className="transition-colors">
//                     <Trash className="size-5 text-red-500 hover:text-red-600 cursor-pointer" />
//                 </button>
//             </DialogTrigger>
//             <DialogContent className="max-w-sm p-6 rounded-2xl bg-white dark:bg-[#1e1e20] border border-gray-100 dark:border-neutral-800 text-center shadow-xl data-[state=open]:animate-[scaleUp_0.3s_ease-out]">
//                 <DialogHeader>
//                     <DialogTitle className="text-lg font-semibold text-red-500">
//                         {p("delete_traveller")}
//                     </DialogTitle>
//                     <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
//                         {p("delete_traveller_confirmation", {
//                             traveller: `${first_name} ${last_name}`,
//                         })}
//                     </DialogDescription>
//                 </DialogHeader>
//                 <div className="flex justify-end gap-3 mt-6 ">
//                     <Button variant="outline">{p("cancel")}</Button>
//                     <Button
//                         className="bg-red-500 hover:bg-red-600 text-white"
//                         onClick={() =>
//                             handleDeleteTraveller(traveller.id, userId)
//                         }
//                     >
//                         {p("delete")}
//                     </Button>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// }
