# 🔄 Migration Strategy - Old Code to New Architecture

## Current Status

 **Old code is SAFE** - Still exists and works normally  
 **New code is READY** - Production-ready components  
 **No conflicts** - Both can coexist  

---

## 🎯 Recommended Migration Strategy

### **Phase 1: Preparation (Week 1)**

#### **1. Team Training**
- [ ] Review MIGRATION_GUIDE.md with team
- [ ] Review EXAMPLES.jsx for usage patterns
- [ ] Discuss new architecture benefits
- [ ] Assign migration tasks

#### **2. Testing Setup**
- [ ] Set up unit tests for new components
- [ ] Create integration tests
- [ ] Establish testing checklist

---

### **Phase 2: Gradual Migration (Weeks 2-4)**

#### **Step 1: Start with New Features**
Use new components for any new pages/features:

```javascript
// New feature - use new components
import { FlightSearchForm } from '@/app/_modules/flight/search/components/templates';

function NewSearchPage() {
    return <FlightSearchForm {...props} />;
}
```

#### **Step 2: Replace One Component at a Time**

**Week 2: Replace TripType**
```javascript
// Before
import TripType from './desktop/TripType';
<TripType tripType={tripType} setTripType={setTripType} />

// After
import { TripTypeSelector } from './molecules';
<TripTypeSelector tripType={tripType} setTripType={setTripType} />
```

**Week 3: Replace PassengersAndClass**
```javascript
// Before
import PassengersAndClass from './desktop/PassengersAndClass';
<PassengersAndClass {...props} />

// After
import { PassengerClassPicker } from './organisms';
<PassengerClassPicker {...props} />
```

**Week 4: Replace Date**
```javascript
// Before
import Dates from './desktop/Date';
<Dates {...props} />

// After
import { DatePicker } from './organisms';
<DatePicker {...props} />
```

---

### **Phase 3: Cleanup (Week 5)**

#### **1. Verify All Replacements**
- [ ] Check all imports in project
- [ ] Ensure no files import from `desktop/` or `mobile/`
- [ ] Run full test suite
- [ ] Perform manual testing

#### **2. Remove Old Code**
```bash
# Only after 100% verification!
rm -rf app/_modules/flight/search/components/desktop
rm -rf app/_modules/flight/search/components/mobile
```

#### **3. Update Documentation**
- [ ] Update README
- [ ] Update component docs
- [ ] Archive old documentation

---

## 🔍 How to Find Old Imports

### **Search for Old Imports**
```bash
# Find all files importing from desktop/
grep -r "from.*desktop" app/

# Find all files importing from mobile/
grep -r "from.*mobile" app/

# Find specific old components
grep -r "import.*TripType.*from.*desktop" app/
grep -r "import.*PassengersAndClass" app/
grep -r "import.*Dates.*from.*desktop" app/
```

### **Replace Imports**

**Old Pattern:**
```javascript
import TripType from '../desktop/TripType';
import PassengersAndClass from '../desktop/PassengersAndClass';
import Dates from '../desktop/Date';
```

**New Pattern:**
```javascript
import { TripTypeSelector } from '../molecules';
import { PassengerClassPicker, DatePicker } from '../organisms';
// Or use the complete template
import { FlightSearchForm } from '../templates';
```

---

##  Migration Checklist

### **Before Migration**
- [ ] Read all documentation
- [ ] Understand new architecture
- [ ] Set up testing environment
- [ ] Create backup branch
- [ ] Inform team members

### **During Migration**
- [ ] Migrate one component at a time
- [ ] Test after each change
- [ ] Update imports systematically
- [ ] Document any issues
- [ ] Keep old code until verified

### **After Migration**
- [ ] Full regression testing
- [ ] Performance testing
- [ ] Accessibility audit
- [ ] Code review
- [ ] Remove old code
- [ ] Update documentation

---

##  Important Warnings

### **DO NOT:**
-  Delete old code immediately
-  Migrate everything at once
-  Skip testing
-  Ignore team feedback

### **DO:**
-  Migrate gradually
-  Test thoroughly
-  Keep old code as backup
-  Document changes
-  Communicate with team

---

## 🚨 Rollback Plan

If something goes wrong:

### **Quick Rollback**
```bash
# Revert to old imports
git checkout HEAD -- path/to/file.js
```

### **Full Rollback**
```bash
# Revert entire branch
git reset --hard origin/main
```

### **Partial Rollback**
Keep new components but use old ones temporarily:
```javascript
// Temporarily switch back
import TripType from './desktop/TripType'; // Old (working)
// import { TripTypeSelector } from './molecules'; // New (if issues)
```

---

## 📊 Migration Progress Tracker

### **Components to Migrate**

| Component | Old Location | New Location | Status | Tested |
|-----------|-------------|--------------|--------|--------|
| TripType | desktop/TripType.js | molecules/TripTypeSelector.jsx | ⏳ Pending | ⬜ |
| PassengersAndClass | desktop/PassengersAndClass.js | organisms/PassengerClassPicker.jsx | ⏳ Pending | ⬜ |
| Date | desktop/Date.js | organisms/DatePicker.jsx | ⏳ Pending | ⬜ |
| DestinationsContent | desktop/DestinationsContent.js | molecules/DestinationList.jsx | ⏳ Pending | ⬜ |
| DateRangeDialog | mobile/DateRangeDialog.js | organisms/Dialogs/DatePickerDialog.jsx | ⏳ Pending | ⬜ |
| PassengerClassModal | mobile/PassengerClassModal.js | organisms/Dialogs/PassengerClassDialog.jsx | ⏳ Pending | ⬜ |

**Legend:**
- ⏳ Pending
- 🔄 In Progress
-  Complete
- ⬜ Not Tested
-  Tested

---

## 🎯 Success Criteria

Migration is successful when:

-  All old imports replaced
-  All tests passing
-  No functionality lost
-  Performance maintained or improved
-  Team comfortable with new code
-  Documentation updated
-  Old code safely removed

---

## 📞 Support

If you encounter issues during migration:

1. **Check EXAMPLES.jsx** - See usage patterns
2. **Check MIGRATION_GUIDE.md** - Detailed instructions
3. **Check component JSDoc** - Component documentation
4. **Ask team** - Collaborate on solutions
5. **Rollback if needed** - Safety first!

---

**Remember: Take your time, test thoroughly, and migrate gradually!** 🎯
