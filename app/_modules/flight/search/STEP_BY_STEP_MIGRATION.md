# 🚀 Gradual Migration Plan - Step by Step

##  Current Situation

**Main File:** `FlightSearchWrapper.jsx`

**Current Imports:**
```javascript
import { FlightSearchFormDesktop } from "./desktop/FlightSearchFromDesktop";
import { FlightSearchForm } from "./mobile/FlightSearchFormMobile";
```

**Status:**  Found 1 main file to migrate

---

## 🎯 Migration Plan (3 Steps)

### **Step 1: Create New Wrapper (Safe - No Breaking Changes)**

Create a new wrapper using the new components alongside the old one.

**File:** `components/FlightSearchWrapperNew.jsx` (NEW)

```javascript
import useIsDevice from "@/app/_hooks/useIsDevice";
import { FlightSearchForm } from "./templates/FlightSearchForm";
// Import other needed components

export default function FlightSearchWrapperNew() {
    const { mobile } = useIsDevice();
    
    // Your search logic here
    const [tripType, setTripType] = useState('roundtrip');
    const [departDate, setDepartDate] = useState(new Date());
    // ... other state
    
    return (
        <FlightSearchForm
            tripType={tripType}
            setTripType={setTripType}
            departDate={departDate}
            setDepartDate={setDepartDate}
            // ... other props
            destinationInputs={<YourDestinationInputs />}
            actionButtons={<YourSearchButton />}
        />
    );
}
```

**Test:** Use this in a test page first, verify it works.

---

### **Step 2: Gradual Replacement (After Testing)**

Once `FlightSearchWrapperNew.jsx` is tested and working:

**Option A: Feature Flag (Recommended)**
```javascript
// FlightSearchWrapper.jsx
import useIsDevice from "@/app/_hooks/useIsDevice";
import { FlightSearchFormDesktop } from "./desktop/FlightSearchFromDesktop";
import { FlightSearchForm } from "./mobile/FlightSearchFormMobile";
import FlightSearchWrapperNew from "./FlightSearchWrapperNew"; // NEW

// Feature flag (can be env variable)
const USE_NEW_COMPONENTS = process.env.NEXT_PUBLIC_USE_NEW_SEARCH === 'true';

export default function FlightSearchWrapper() {
    if (USE_NEW_COMPONENTS) {
        return <FlightSearchWrapperNew />;
    }
    
    // Old code (fallback)
    const { mobile } = useIsDevice();
    return mobile ? <FlightSearchForm /> : <FlightSearchFormDesktop />;
}
```

**Option B: Direct Replacement (After Confidence)**
```javascript
// FlightSearchWrapper.jsx
import FlightSearchWrapperNew from "./FlightSearchWrapperNew";

export default function FlightSearchWrapper() {
    return <FlightSearchWrapperNew />;
}
```

---

### **Step 3: Cleanup (After 2-4 Weeks)**

After everything is stable:

1. **Archive old code:**
```bash
mkdir -p app/_modules/flight/search/components/_archived
mv app/_modules/flight/search/components/desktop app/_modules/flight/search/components/_archived/
mv app/_modules/flight/search/components/mobile app/_modules/flight/search/components/_archived/
```

2. **Update FlightSearchWrapper.jsx:**
```javascript
// Final clean version
import useIsDevice from "@/app/_hooks/useIsDevice";
import { FlightSearchForm } from "./templates/FlightSearchForm";

export default function FlightSearchWrapper() {
    // Implementation using new components
    return <FlightSearchForm {...props} />;
}
```

3. **Remove FlightSearchWrapperNew.jsx** (merge into main wrapper)

---

## 📝 Detailed Step 1: Create New Wrapper

Let me help you create the new wrapper now!

### **What we need to know:**

1. **What state does the old FlightSearchFormDesktop use?**
   - Trip type
   - Dates
   - Passengers
   - Destinations
   - etc.

2. **What props does it need?**

3. **What actions does it perform?**
   - Search
   - Validation
   - etc.

---

## 🔍 Let's Examine Old Components

I'll check the old desktop component to understand what we need to replicate:
