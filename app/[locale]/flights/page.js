import { FlightSearchForm } from "@/app/_components/flightSearchFormMobile/FlightSearchFormMobile";

function page() {
  return (
    <section>
      <div className="w-full-main-colors">
        <div className="container-custom">
          {" "}
          <FlightSearchForm />
        </div>
      </div>
    </section>
  );
}

export default page;
