#  DANGER: Old Code Removal Script

## WARNING
**DO NOT RUN THIS unless you are 100% sure!**

This script will DELETE the old code permanently.

---

## Prerequisites

Before running this script, ensure:

- [ ] All new components tested
- [ ] All imports updated
- [ ] Full test suite passing
- [ ] Manual testing complete
- [ ] Team approval obtained
- [ ] Backup created

---

## Removal Commands

### **Step 1: Create Backup**
```bash
# Create backup branch
git checkout -b backup-old-components
git add .
git commit -m "Backup before removing old components"
git push origin backup-old-components

# Return to main branch
git checkout main
```

### **Step 2: Verify No Imports**
```bash
# Search for any remaining imports from old code
grep -r "from.*desktop" app/ || echo " No desktop imports found"
grep -r "from.*mobile" app/ || echo " No mobile imports found"

# If any found, DO NOT PROCEED!
```

### **Step 3: Remove Old Code (DANGER!)**
```bash
# Only run if Step 2 shows NO imports!

# Remove desktop components
rm -rf app/_modules/flight/search/components/desktop

# Remove mobile components  
rm -rf app/_modules/flight/search/components/mobile

# Commit changes
git add .
git commit -m "Remove old desktop and mobile components"
```

### **Step 4: Verify Application**
```bash
# Run dev server
npm run dev

# Run tests
npm test

# Build production
npm run build
```

### **Step 5: Rollback if Needed**
```bash
# If something breaks, rollback immediately!
git reset --hard HEAD~1

# Or restore from backup branch
git checkout backup-old-components -- app/_modules/flight/search/components/
```

---

## Alternative: Archive Instead of Delete

**Safer option:**
```bash
# Create archive folder
mkdir -p app/_modules/flight/search/components/_archived

# Move old code to archive
mv app/_modules/flight/search/components/desktop app/_modules/flight/search/components/_archived/
mv app/_modules/flight/search/components/mobile app/_modules/flight/search/components/_archived/

# Add note
echo "# Archived Components

These components were replaced by the new atomic design structure.
Archived on: $(date)

See MIGRATION_STRATEGY.md for details.
" > app/_modules/flight/search/components/_archived/README.md
```

---

## Recommended Approach

**DON'T delete immediately!**

Instead:
1. Keep old code for 2-4 weeks
2. Monitor for any issues
3. After confidence is high, archive (not delete)
4. After 2-3 months, delete archived code

---

**Remember: You can always restore from git history, but it's easier to keep a backup!**
