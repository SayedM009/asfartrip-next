# Flight Search - Architecture Refactoring

## 📁 New Structure (Feature-Based + Atomic Design)

```
search/
├── components/
│   ├── atoms/               Created - Small, reusable components
│   │   ├── TripTypeButton.jsx
│   │   └── index.js
│   │
│   ├── molecules/           Created - Combinations of atoms
│   │   ├── TripTypeSelector.jsx
│   │   └── index.js
│   │
│   ├── organisms/          🔄 To be created - Complex components
│   │   └── (Coming soon)
│   │
│   ├── templates/          🔄 To be created - Page layouts
│   │   └── (Coming soon)
│   │
│   ├── desktop/             Legacy - Will be refactored
│   └── mobile/              Legacy - Will be refactored
│
├── constants/               Created - Shared constants
│   ├── tripTypes.js
│   ├── cabinClasses.js
│   ├── passengerTypes.js
│   └── index.js
│
├── hooks/                   Existing
├── logic/                   Existing (Well organized!)
└── services/                Existing
```

## 🎯 Migration Status

###  Completed
1. **Constants Layer**
   - `tripTypes.js` - Trip type constants and labels
   - `cabinClasses.js` - Cabin class constants
   - `passengerTypes.js` - Passenger limits and labels

2. **Atoms Layer**
   - `TripTypeButton.jsx` - Reusable trip type button

3. **Molecules Layer**
   - `TripTypeSelector.jsx` - Trip type selector with sliding background

### 🔄 In Progress
- Creating more atoms and molecules from existing components

###  Next Steps
1. Extract more atoms from `PassengersAndClass.js`:
   - `PassengerCounter.jsx`
   - `ClassOption.jsx`

2. Create molecules:
   - `PassengerSelector.jsx`
   - `ClassSelector.jsx`
   - `DatePicker.jsx`
   - `DestinationInput.jsx`

3. Reorganize organisms:
   - Move dialogs to `organisms/Dialogs/`
   - Create `SearchForm/` folder

4. Update imports in existing files

## 🔗 Usage Examples

### Using New Components

```javascript
// Old way (still works)
import TripType from '../desktop/TripType';

// New way (recommended)
import { TripTypeSelector } from '../molecules';
// or
import TripTypeSelector from '../molecules/TripTypeSelector';
```

### Using Constants

```javascript
// Import constants
import { TRIP_TYPES, CABIN_CLASSES, PASSENGER_LIMITS } from '../../constants';

// Use in code
if (tripType === TRIP_TYPES.ONE_WAY) {
  // ...
}
```

##  Important Notes

- **Legacy files are NOT deleted** - They still work!
- **Gradual migration** - New components work alongside old ones
- **No breaking changes** - Existing code continues to function
- **Test new components** before removing old ones

## 🚀 Benefits

1. **Reusability** - Atoms can be used anywhere
2. **Consistency** - Shared constants ensure uniformity
3. **Maintainability** - Clear separation of concerns
4. **Testability** - Smaller components are easier to test
5. **Scalability** - Easy to add new features

---

**Last Updated:** 2025-11-23
**Status:** 🟡 In Progress (Phase 1 Complete)
