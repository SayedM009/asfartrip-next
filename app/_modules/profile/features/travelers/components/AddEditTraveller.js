import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { TravelerBasicFieldsSkeleton } from "@/app/_components/TravelerBasicFieldsSkeleton";
import { useTravelerDialogLogic } from "@/app/_hooks/useTravelerDialogLogic";
import TravelerBasicFields from "@/app/_components/TravelerBasicFields";

// هذا المكوّن يقدر يشتغل بطريقتين:
// 1) كـ زر Edit جنب المسافر: <AddEditTraveller traveller={trav} userId={3} asIcon />
// 2) كـ زر إضافة من تحت: <AddEditTraveller userId={3} />
export default function AddEditTraveller({
    traveller,
    userId,
    userType,
    asIcon = false,
}) {
    const p = useTranslations("Profile");
    const [open, setOpen] = useState(false);

    const {
        loading,
        formTraveler,
        handleFieldChange,
        handleSave,
        showValidation,
        resetForm,
    } = useTravelerDialogLogic({
        traveller,
        userId,
        userType,
        onClose: () => setOpen(false),
    });

    // 🧹 لما نقفل الـ Dialog بايدينا، نفرّغ الحقول لو كان إضافة
    const handleOpenChange = (value) => {
        setOpen(value);
        if (!value && !traveller) {
            resetForm();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {asIcon ? (
                <DialogTrigger asChild>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center"
                    >
                        <Edit className="size-5 text-blue-500 hover:text-blue-600 cursor-pointer transition-colors" />
                    </button>
                </DialogTrigger>
            ) : (
                <DialogTrigger className="sticky bottom-0 left-0 right-0 bg-white dark:bg-[#1c1c1e] p-4 border-t border-gray-100 dark:border-neutral-800">
                    <Button className="w-full bg-accent-500 hover:bg-[#cf5f1a] text-white text-sm py-5 rounded-full shadow-md transition-all">
                        {p("add_new_traveller") || "Add New Traveller"}
                    </Button>
                </DialogTrigger>
            )}

            <DialogContent className="max-w-none h-screen bg-white dark:bg-[#111] p-4 overflow-y-auto rounded-none open-slide-left close-slide-left">
                <DialogHeader className="flex flex-row h-10">
                    <DialogTitle className="text-lg font-semibold">
                        {traveller
                            ? p("edit_traveller") || "Edit Traveller"
                            : p("add_edit_travelers") || "Add / Edit Traveller"}
                    </DialogTitle>
                </DialogHeader>

                <div className="min-h-[calc(100vh-120px)] pb-32">
                    {loading ? (
                        <TravelerBasicFieldsSkeleton />
                    ) : (
                        <TravelerBasicFields
                            traveler={formTraveler}
                            onFieldChange={handleFieldChange}
                            showValidation={showValidation}
                        />
                    )}
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1c1c1e] p-4 border-t border-gray-100 dark:border-neutral-800">
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-accent-500 hover:bg-[#cf5f1a] text-white text-sm py-5 rounded-full shadow-md transition-all"
                    >
                        {loading
                            ? p("saving")
                            : traveller
                            ? p("edit_traveller") || "Edit Traveller"
                            : p("save_information") || "Save Information"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
