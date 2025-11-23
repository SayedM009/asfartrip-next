import SingleDatePicker from "../molecules/SingleDatePicker";
import RangeDatePicker from "../molecules/RangeDatePicker";

/**
 * DatePicker - Organism Component
 * Smart date picker that switches between single and range mode based on trip type
 * Direct replacement for the old Date.js component
 * 
 * @param {string} tripType - Trip type ('oneway' or 'roundtrip')
 * @param {Date} departDate - Departure date (for one-way)
 * @param {function} setDepartDate - Set departure date
 * @param {Object} range - Date range (for round-trip) { from: Date, to: Date }
 * @param {function} setRange - Set date range
 * @param {boolean} showLabel - Whether to show labels
 */
export default function DatePicker({
    tripType,
    departDate,
    setDepartDate,
    range,
    setRange,
    showLabel = true,
}) {
    if (tripType === "roundtrip") {
        return (
            <RangeDatePicker
                value={range}
                onChange={setRange}
                showLabel={showLabel}
            />
        );
    }

    return (
        <SingleDatePicker
            value={departDate}
            onChange={setDepartDate}
            showLabel={showLabel}
        />
    );
}
