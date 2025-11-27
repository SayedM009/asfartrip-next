/**
 * Popular Destinations - Shared Constants
 * 
 * Centralized airport data used across desktop and mobile flight search components.
 * Extracted from MainSearchForm.js and DestinationSearchDialog.js to eliminate duplication.
 */

/**
 * Popular GCC (Gulf Cooperation Council) Destinations
 * Used primarily for departure city suggestions
 */
export const popularDestinationsGCC = [
    {
        label_code: "DXB",
        city: "Dubai",
        country: "United Arab Emirates",
        airport: "Dubai International Airport",
    },
    {
        label_code: "AUH",
        city: "Abu Dhabi",
        country: "United Arab Emirates",
        airport: "Zayed International Airport",
    },
    {
        label_code: "SHJ",
        city: "Sharjah",
        country: "United Arab Emirates",
        airport: "Sharjah International Airport",
    },
    {
        label_code: "DOH",
        city: "Doha",
        country: "Qatar",
        airport: "Hamad International Airport",
    },
    {
        label_code: "BAH",
        city: "Manama",
        country: "Bahrain",
        airport: "Bahrain International Airport",
    },
    {
        label_code: "RUH",
        city: "Riyadh",
        country: "Saudi Arabia",
        airport: "King Khalid International Airport",
    },
    {
        label_code: "JED",
        city: "Jeddah",
        country: "Saudi Arabia",
        airport: "King Abdulaziz International Airport",
    },
    {
        label_code: "DMM",
        city: "Dammam",
        country: "Saudi Arabia",
        airport: "King Fahd International Airport",
    },
    {
        label_code: "MCT",
        city: "Muscat",
        country: "Oman",
        airport: "Muscat International Airport",
    },
    {
        label_code: "KWI",
        city: "Kuwait City",
        country: "Kuwait",
        airport: "Kuwait International Airport",
    },
];

/**
 * Popular International Destinations
 * Used primarily for destination city suggestions
 */
export const popularInternationalDestinations = [
    {
        label_code: "CAI",
        city: "Cairo",
        country: "Egypt",
        airport: "Cairo International Airport",
    },
    {
        label_code: "IST",
        city: "Istanbul",
        country: "Turkey",
        airport: "Istanbul Airport",
    },
    {
        label_code: "BOM",
        city: "Mumbai",
        country: "India",
        airport: "Chhatrapati Shivaji International Airport",
    },
    {
        label_code: "LHR",
        city: "London",
        country: "United Kingdom",
        airport: "Heathrow Airport",
    },
    {
        label_code: "MNL",
        city: "Manila",
        country: "Philippines",
        airport: "Ninoy Aquino International Airport",
    },
    {
        label_code: "LHE",
        city: "Lahore",
        country: "Pakistan",
        airport: "Allama Iqbal International Airport",
    },
    {
        label_code: "CMB",
        city: "Colombo",
        country: "Sri Lanka",
        airport: "Bandaranaike International Airport",
    },
    {
        label_code: "KTM",
        city: "Kathmandu",
        country: "Nepal",
        airport: "Tribhuvan International Airport",
    },
    {
        label_code: "DAC",
        city: "Dhaka",
        country: "Bangladesh",
        airport: "Hazrat Shahjalal International Airport",
    },
    {
        label_code: "SIN",
        city: "Singapore",
        country: "Singapore",
        airport: "Changi Airport",
    },
];

/**
 * Popular Cities for Mobile Quick Selection
 * Subset of most frequently searched destinations
 */
export const popularCities = [
    { city: "cairo", label_code: "CAI", country: "EGYPT" },
    { city: "manila", label_code: "MNL", country: "PHILIPPINES" },
    { city: "sharjah", label_code: "SHJ", country: "UAE" },
    { city: "london", label_code: "LON", country: "UK" },
    { city: "dubai", label_code: "DXB", country: "UAE" },
    { city: "jeddah", label_code: "JED", country: "SAUDI_ARABIA" },
];

/**
 * Destinations Grouped by Region
 * Used in mobile for browsing by geographic area
 */
export const destinationsByRegion = {
    asia: [
        { city: "dubai", label_code: "DXB", country: "UAE" },
        { city: "abu dhabi", label_code: "AUH", country: "UAE" },
        { city: "sharjah", label_code: "SHJ", country: "UAE" },
        { city: "kochi", label_code: "COK", country: "INDIA" },
        { city: "kozhikode", label_code: "CCJ", country: "INDIA" },
        { city: "manila", label_code: "MNL", country: "PHILIPPINES" },
    ],
    europe: [
        { city: "london", label_code: "LON", country: "UK" },
        { city: "madrid", label_code: "MAD", country: "SPAIN" },
        { city: "milan", label_code: "MIL", country: "ITALY" },
        { city: "tbilisi", label_code: "TBS", country: "GEORGIA" },
        { city: "paris", label_code: "PAR", country: "FRANCE" },
        { city: "amsterdam", label_code: "AMS", country: "NETHERLANDS" },
    ],
    africa: [
        { city: "cairo", label_code: "CAI", country: "EGYPT" },
        { city: "south africa", label_code: "JNB", country: "SOUTH_AFRICA" },
        { city: "alexandria", label_code: "HBE", country: "EGYPT" },
        { city: "casablanca", label_code: "CMN", country: "MOROCCO" },
        { city: "tunis", label_code: "TUN", country: "TUNISIA" },
        { city: "algiers", label_code: "ALG", country: "ALGERIA" },
    ],
};
