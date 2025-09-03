import { Bars3BottomRightIcon, Bars3Icon } from "@heroicons/react/24/outline";

function MobileSideMenu() {
  return (
    <div className="block md:hidden icons-hover-600 md:px-2 md:py-1.5">
      <Bars3Icon className="svg" />
    </div>
  );
}

export default MobileSideMenu;
