import { FlightSearchForm } from "@/app/_components/flightSearchFormMobile/FlightSearchFormMobile";
import ServicesNavigation from "@/app/_components/ServicesNavigation";
import Navbar from "@/app/_components/Navbar";

function page() {
  return (
    <section>
      <div className="w-full-main-colors">
        <div className="container-custom">
          <FlightSearchForm />
        </div>
      </div>
    </section>
  );
}

export default page;
