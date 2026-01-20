import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Calendar } from "@/components/ui/calendar";
import { startOfToday } from "date-fns";

export default function DateSelectorDialog({
    value,
    onChange,
    t,
    pattern,
    calculateNights,
    dateLocale,
    formatDate,
    handleRangeSelect,
}) {
    return (
        <Dialog>
            <Dialog>
                <DialogTrigger
                    asChild
                    className="col-span-3 border px-3 rounded-sm cursor-pointer flex justify-between items-center py-3 md:py-0 md:hidden"
                >
                    <div>
                        <div className="flex flex-col items-start">
                            <Label className="text-xs">{t("check_in")}</Label>
                            <span className="text-sm font-bold">
                                {formatDate(value?.from || new Date(), {
                                    pattern,
                                })}
                            </span>
                        </div>

                        <p className="text-xs">
                            {calculateNights()}{" "}
                            {calculateNights() > 1 ? t("nights") : t("night")}
                        </p>

                        <div className="flex flex-col items-end">
                            <Label className="text-xs">{t("check_out")}</Label>
                            <span className="text-sm font-bold">
                                {formatDate(
                                    value?.to ||
                                        new Date(
                                            new Date().getTime() +
                                                24 * 60 * 60 * 1000,
                                        ),
                                    { pattern },
                                )}
                            </span>
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent className="h-full w-full max-w-none overflow-y-auto border-0 rounded-none p-0 !top-0 !left-0 !translate-x-0 !translate-y-0 flex flex-col items-start justify-start">
                    <DialogHeader className="w-full p-4 border-b bg-background text-left rtl:text-right">
                        <DialogTitle>{t("date_selection")}</DialogTitle>
                        <DialogDescription className="sr-only">
                            {t("date_selection")}
                        </DialogDescription>
                    </DialogHeader>
                    <Calendar
                        className="w-full"
                        mode="range"
                        numberOfMonths={12}
                        selected={value}
                        onSelect={(newRange) =>
                            handleRangeSelect(newRange, onChange, value)
                        }
                        locale={dateLocale}
                        startMonth={new Date()}
                        disabled={(date) => date < startOfToday()}
                        hideNavigation
                    />
                    <DialogFooter className="w-full p-4 border-t bg-background text-left rtl:text-right sticky bottom-0 ">
                        <DialogClose asChild>
                            <Button
                                variant="default"
                                className="bg-accent-600 dark:text-white"
                            >
                                {t("select")}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Dialog>
    );
}
