"use client";
import { useState, useEffect } from "react";

// Old components (fallback)
import { FlightSearchFormDesktop } from "./desktop/FlightSearchFromDesktop";
import { FlightSearchForm as FlightSearchFormMobile } from "./mobile/FlightSearchFormMobile";

// ✨ NEW component
import FlightSearchFormNew from "./FlightSearchFormNew";

/**
 * FlightSearchWrapper - Smart Wrapper with Feature Flag
 * 
 * This wrapper allows gradual migration:
 * - Set USE_NEW_COMPONENTS=true to use new atomic design components
 * - Set USE_NEW_COMPONENTS=false to use old components (safe fallback)
 */

// Feature Flag - Change to true to test new components
const USE_NEW_COMPONENTS = true; //  Testing new components!

export default function FlightSearchWrapper() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if mobile on client side
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Use new components if flag is true (desktop only for now)
    if (USE_NEW_COMPONENTS && !isMobile) {
        return <FlightSearchFormNew />;
    }

    // Fallback to old components
    return isMobile ? <FlightSearchFormMobile /> : <FlightSearchFormDesktop />;
}

/**
 * Migration Progress:
 * 
 *  Phase 1: Created new components (atoms, molecules, organisms)
 *  Phase 2: Created FlightSearchFormNew (desktop)
 * 🔄 Phase 3: Testing new components (current)
 * ⏳ Phase 4: Migrate mobile components
 * ⏳ Phase 5: Remove old components
 * 
 * To enable new components:
 * 1. Add to .env.local: NEXT_PUBLIC_USE_NEW_SEARCH=true
 * 2. Or change USE_NEW_COMPONENTS constant above
 * 3. Test thoroughly
 * 4. If issues, set back to false (instant rollback!)
 */
