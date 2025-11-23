# Migration Guide - Flight Search Refactoring

## 📚 How to Use New Components

### 1. Using Atoms (Small Components)

#### TripTypeButton
```javascript
import { TripTypeButton } from '@/app/_modules/flight/search/components/atoms';

<TripTypeButton
  type="oneway"
  isActive={tripType === "oneway"}
  onClick={() => setTripType("oneway")}
  label="One Way"
/>
```

#### PassengerCounter
```javascript
import { PassengerCounter } from '@/app/_modules/flight/search/components/atoms';

<PassengerCounter
  value={passengers.adults}
  onIncrement={() => updatePassengers('adults', true)}
  onDecrement={() => updatePassengers('adults', false)}
  canIncrement={canAddPassenger('adults', passengers)}
  canDecrement={canRemovePassenger('adults', passengers)}
  label="Adults"
/>
```

#### PassengerTypeRow
```javascript
import { PassengerTypeRow, PassengerCounter } from '@/app/_modules/flight/search/components/atoms';
import { User } from 'lucide-react';

<PassengerTypeRow
  icon={User}
  label="Adults"
  description="12+ years"
>
  <PassengerCounter {...counterProps} />
</PassengerTypeRow>
```

### 2. Using Molecules (Combined Components)

#### TripTypeSelector
```javascript
import { TripTypeSelector } from '@/app/_modules/flight/search/components/molecules';

// Replaces the old TripType component
<TripTypeSelector
  tripType={tripType}
  setTripType={setTripType}
/>
```

### 3. Using Constants

```javascript
import { 
  TRIP_TYPES, 
  CABIN_CLASSES, 
  PASSENGER_LIMITS,
  PASSENGER_LABELS 
} from '@/app/_modules/flight/search/constants';

// Check trip type
if (tripType === TRIP_TYPES.ONE_WAY) {
  // ...
}

// Get passenger limits
const maxAdults = PASSENGER_LIMITS.adults.max; // 9

// Use labels
const label = PASSENGER_LABELS.adults; // "Adults"
```

## 🔄 Migration Examples

### Before (Old Way)
```javascript
// Old import
import TripType from '../desktop/TripType';

// Old usage
<TripType tripType={tripType} setTripType={setTripType} />
```

### After (New Way)
```javascript
// New import
import { TripTypeSelector } from '../molecules';

// New usage (same props!)
<TripTypeSelector tripType={tripType} setTripType={setTripType} />
```

## ✅ Benefits of New Structure

### 1. **Reusability**
```javascript
// Use PassengerCounter anywhere!
<PassengerCounter 
  value={roomCount}
  onIncrement={() => setRoomCount(prev => prev + 1)}
  onDecrement={() => setRoomCount(prev => prev - 1)}
  label="Rooms"
/>
```

### 2. **Consistency**
```javascript
// All trip types use the same constant
const types = Object.values(TRIP_TYPES); // ['oneWay', 'roundTrip', 'multiCity']
```

### 3. **Easy Testing**
```javascript
// Test atoms in isolation
test('PassengerCounter increments correctly', () => {
  const onIncrement = jest.fn();
  render(<PassengerCounter value={1} onIncrement={onIncrement} />);
  // ...
});
```

## 🚨 Important Notes

### Backward Compatibility
- **Old components still work!** No need to rush migration
- New components can be used alongside old ones
- Migrate gradually, one component at a time

### File Locations
```
Old: components/desktop/TripType.js
New: components/molecules/TripTypeSelector.jsx
     components/atoms/TripTypeButton.jsx
```

### Import Paths
```javascript
// Both work!
import { TripTypeSelector } from '../molecules';
import TripTypeSelector from '../molecules/TripTypeSelector';
```

## 📋 Migration Checklist

When migrating a component:

- [ ] Create atom versions of small UI elements
- [ ] Create molecule that combines atoms
- [ ] Test new component works correctly
- [ ] Update imports in parent components
- [ ] Verify functionality hasn't changed
- [ ] (Optional) Remove old component file

## 🎯 Next Components to Migrate

1. **DatePicker** (from `Date.js`)
2. **DestinationInput** (from `DestinationsContent.js`)
3. **PassengerSelector** (from `PassengersAndClass.js`)
4. **ClassSelector** (from `PassengersAndClass.js`)

## 💡 Tips

1. **Start small**: Migrate atoms first, then molecules
2. **Test thoroughly**: Ensure new components work before removing old ones
3. **Use constants**: Replace hardcoded strings with constants
4. **Document changes**: Update README as you go

---

**Questions?** Check `REFACTORING.md` for architecture overview
