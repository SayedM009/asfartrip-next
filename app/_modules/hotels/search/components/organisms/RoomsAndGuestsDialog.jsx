import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Minus, Plus } from "lucide-react";
import {
    ROOMS_MIN,
    ROOMS_MAX,
    ADULTS_MIN,
    ADULTS_MAX,
    CHILDREN_MIN,
    CHILDREN_MAX,
} from "../../constants/guestLimits";
import GuestCounter from "../molecules/GuestCounter";
import ChildAgeSelector from "../molecules/ChildAgeSelector";

export default function RoomsAndGuestsDialog({
    rooms,
    totalAdults,
    totalChildren,
    addRoom,
    removeRoom,
    updateRoom,
    updateChildren,
    updateChildAge,
    t,
}) {
    return (
        <Dialog>
            <DialogTrigger
                asChild
                className="col-span-3 border px-3 rounded-sm cursor-pointer py-2.5 md:py-0 block md:hidden text-left rtl:text-right"
            >
                <div>
                    <Label className="text-xs">{t("rooms_and_guests")}</Label>
                    <p className="text-sm font-bold text-left rtl:text-right">
                        {rooms.length}{" "}
                        {rooms.length > 1 ? t("rooms") : t("room")},{" "}
                        {totalAdults} {t("adults")}, {totalChildren}{" "}
                        {t("children")}
                    </p>
                </div>
            </DialogTrigger>
            <DialogContent className="h-full w-full max-w-none overflow-y-auto border-0 rounded-none p-0 !top-0 !left-0 !translate-x-0 !translate-y-0 flex flex-col items-start justify-start">
                <DialogHeader className="w-full p-4 border-b bg-background text-left rtl:text-right">
                    <DialogTitle>{t("rooms_and_guests")}</DialogTitle>
                    <DialogDescription className="sr-only">
                        {t("rooms_and_guests")}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 p-4 w-full">
                    {/* Room count control */}
                    <div className="flex items-center justify-between gap-2 pb-4 border-b">
                        <Label className="text-sm font-bold">
                            {t("rooms")}
                        </Label>
                        <div className="flex items-center">
                            <Button
                                variant="outline"
                                className="w-8 h-8 rounded-full cursor-pointer border border-accent-500 text-accent-500 hover:bg-accent-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={removeRoom}
                                disabled={rooms.length <= ROOMS_MIN}
                            >
                                <Minus className="size-4" />
                            </Button>
                            <span className="w-12 text-center text-lg font-bold">
                                {rooms.length}
                            </span>
                            <Button
                                variant="outline"
                                className="w-8 h-8 rounded-full cursor-pointer border border-accent-500 text-accent-500 hover:bg-accent-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={addRoom}
                                disabled={rooms.length >= ROOMS_MAX}
                            >
                                <Plus className="size-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Individual room sections */}
                    {rooms.map((room, roomIndex) => (
                        <div
                            key={roomIndex}
                            className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-muted rounded-lg"
                        >
                            <Label className="text-base font-bold text-accent-500">
                                {t("room")} {roomIndex + 1}
                            </Label>

                            <GuestCounter
                                label={t("adults")}
                                value={room.adults}
                                min={ADULTS_MIN}
                                max={ADULTS_MAX}
                                onChange={(val) =>
                                    updateRoom(roomIndex, "adults", val)
                                }
                            />

                            <GuestCounter
                                label={t("children")}
                                value={room.children}
                                min={CHILDREN_MIN}
                                max={CHILDREN_MAX}
                                onChange={(val) =>
                                    updateChildren(roomIndex, val)
                                }
                            />

                            {room.children > 0 && (
                                <div className="flex flex-col gap-3 mt-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <Label className="text-sm text-muted-foreground">
                                        {t("children_ages")}
                                    </Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {room.childrenAges.map(
                                            (age, childIndex) => (
                                                <ChildAgeSelector
                                                    key={childIndex}
                                                    index={childIndex}
                                                    age={age}
                                                    onChange={(newAge) =>
                                                        updateChildAge(
                                                            roomIndex,
                                                            childIndex,
                                                            newAge,
                                                        )
                                                    }
                                                    t={t}
                                                />
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
