import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

function DeleteAccount({ showDeleteDialog, onOpenChange }) {
    const p = useTranslations("Profile");
    return (
        <Dialog open={showDeleteDialog} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm p-6 rounded-2xl bg-white dark:bg-[#1e1e20] border border-gray-100 dark:border-neutral-800 text-center shadow-xl data-[state=open]:animate-[scaleUp_0.3s_ease-out]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-red-500">
                        {p("delete_account")}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                        {p("delete_account_confirmation")}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-3 mt-6 ">
                    <Button
                        variant="outline"
                        onClick={() => setShowDeleteDialog(false)}
                    >
                        {p("cancel")}
                    </Button>
                    <Button className="bg-red-500 hover:bg-red-600 text-white">
                        {p("delete")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteAccount;
