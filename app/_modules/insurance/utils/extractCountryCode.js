export function extractCountryCode(destination) {
    return destination.includes("-") ? destination.split("-")[1] : destination;
}