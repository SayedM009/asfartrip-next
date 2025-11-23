import { TripTypeSelector } from "../molecules/TripTypeSelector";
import { PassengerClassPicker } from "../organisms/PassengerClassPicker";
import { DatePicker } from "../organisms/DatePicker";

/**
 * FlightSearchForm - Template Component
 * Complete flight search form combining all organisms
 * This is a template that can be used for both desktop and mobile
 * 
 * @param {string} tripType - Trip type ('oneway' or 'roundtrip')
 * @param {function} setTripType - Set trip type
 * @param {Date} departDate - Departure date
 * @param {function} setDepartDate - Set departure date
 * @param {Object} range - Date range for round-trip
 * @param {function} setRange - Set date range
 * @param {Object} passengers - Passenger counts
 * @param {function} setPassengers - Set passengers
 * @param {string} travelClass - Travel class
 * @param {function} setTravelClass - Set travel class
 * @param {React.ReactNode} destinationInputs - Destination input components
 * @param {React.ReactNode} actionButtons - Action buttons (search, etc.)
 * @param {boolean} showLabels - Whether to show labels
 */
export default function FlightSearchForm({
    tripType,
    setTripType,
    departDate,
    setDepartDate,
    range,
    setRange,
    passengers,
    setPassengers,
    travelClass,
    setTravelClass,
    destinationInputs,
    actionButtons,
    showLabels = true,
}) {
    return (
        <div className="space-y-4">
            {/* Trip Type Selector */}
            <TripTypeSelector 
                tripType={tripType} 
                setTripType={setTripType} 
            />

            {/* Destination Inputs (passed as children for flexibility) */}
            {destinationInputs}

            {/* Date Picker */}
            <DatePicker
                tripType={tripType}
                departDate={departDate}
                setDepartDate={setDepartDate}
                range={range}
                setRange={setRange}
                showLabel={showLabels}
            />

            {/* Passenger & Class Picker */}
            <PassengerClassPicker
                passengers={passengers}
                setPassengers={setPassengers}
                travelClass={travelClass}
                setTravelClass={setTravelClass}
                showLabel={showLabels}
            />

            {/* Action Buttons (search, reset, etc.) */}
            {actionButtons}
        </div>
    );
}
