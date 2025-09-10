import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { SquaresPlusIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "../LanguageSwitcher";
function MoreButton() {
  const t = useTranslations("Homepage");
  return (
    <Dialog>
      <DialogTrigger>
        <div className="  pt-2 pb-0.5 w-1/12 flex flex-col items-center">
          <SquaresPlusIcon className="w-6 " />
          <span className="text-[11px] mt-0.5 font-bold ">{t("more")}</span>
        </div>
      </DialogTrigger>
      <DialogContent
        className={cn(
          " bg-background  pt-4 px-0",
          "max-w-none w-full h-full rounded-none border-0  md:h-11/12 md:rounded",
          "data-[state=open]:animate-in data-[state=open]:slide-in-from-left",
          "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left"
        )}
      >
        <DialogHeader>
          <DialogTitle className="shadow-lg w-full pb-5">More</DialogTitle>
          <DialogDescription>
            <section className="bg-primary-100 dark:bg-background mt-2 mx-3 rounded-xl min-h-80 pt-2 flex flex-col  px-4 shadow-xl border-1 border-primary-600 border-dashed">
              <div className="border-b-1 border-primary-100 pb-1 ">
                <LanguageSwitcher />
              </div>
              <div className="py-3 flex text-md font-bold">Dart Mode</div>
              <div>test</div>
            </section>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default MoreButton;
