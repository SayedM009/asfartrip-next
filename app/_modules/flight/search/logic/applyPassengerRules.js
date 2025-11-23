// ===================================================
// Flight Passenger Rules - CORRECTED Implementation
// ===================================================

export function applyPassengerRules({ ADT, CHD, INF }) {
    let adults = Number(ADT) || 0;
    let children = Number(CHD) || 0;
    let infants = Number(INF) || 0;

    // -------------------------------------------------
    // Rule 1: Minimum 1 Adult (ALWAYS)
    // -------------------------------------------------
    if (adults < 1) {
        adults = 1;
    }

    // -------------------------------------------------
    // Rule 2: MAX SEATED = 9 (Adults + Children ONLY)
    // Infants do NOT take seats
    // -------------------------------------------------
    let seated = adults + children;

    if (seated > 9) {
        const overflow = seated - 9;

        // Reduce children first
        if (children >= overflow) {
            children -= overflow;
        } else {
            // If children aren't enough, reduce adults too
            const remaining = overflow - children;
            children = 0;
            adults = Math.max(1, adults - remaining);
        }
    }

    // Recalculate after adjustments
    seated = adults + children;

    // -------------------------------------------------
    // Rule 3: Infants cannot exceed Adults (INF ≤ ADT)
    // Each infant must have an adult
    // -------------------------------------------------
    if (infants > adults) {
        infants = adults;
    }

    return {
        adults,
        children,
        infants,
    };
}

// ===================================================
// Helper function to check if we can ADD passengers
// ===================================================
export function canAddPassenger(type, currentPassengers) {
    const { adults, children, infants } = currentPassengers;
    const seated = adults + children;

    switch (type) {
        case "adults":
            // Can add adults ONLY if total seats < 9
            return seated < 9;

        case "children":
            // Can add children ONLY if total seats < 9
            return seated < 9;

        case "infants":
            // Can add infants ONLY if infants < adults
            // Infants DON'T take seats, so no seat limit check
            return infants < adults;

        default:
            return false;
    }
}

// ===================================================
// Helper function to check if we can REMOVE passengers
// ===================================================
export function canRemovePassenger(type, currentPassengers) {
    const { adults, children, infants } = currentPassengers;

    switch (type) {
        case "adults":
            // Cannot reduce below 1 adult
            return adults > 1;

        case "children":
            // Can always reduce children to 0
            return children > 0;

        case "infants":
            // Can always reduce infants to 0
            return infants > 0;

        default:
            return false;
    }
}

// ===================================================
// Get passenger summary text
// ===================================================
export function getPassengerSummary(passengers) {
    const { adults, children, infants } = passengers;
    const seated = adults + children;

    return {
        total: adults + children + infants,
        seated: seated,
        infants: infants,
        seatsRemaining: 9 - seated,
    };
}
