function handleRangeSelect(newRange, onRangeChange, range) {
    if (!newRange) {
        onRangeChange({ from: null, to: null });
        return;
    }

    // Check if from and to are the same date (first click)
    const fromTime =
        newRange.from instanceof Date
            ? newRange.from.getTime()
            : new Date(newRange.from).getTime();
    const toTime =
        newRange.to instanceof Date
            ? newRange.to.getTime()
            : new Date(newRange.to).getTime();
    const isSameDate = newRange.from && newRange.to && fromTime === toTime;

    // If same date, treat as first click - only set 'from', keep popover open
    if (isSameDate) {
        onRangeChange({ from: newRange.from, to: null });
        return;
    }

    // If we already have a complete range and user clicked a new date,
    // Reset and start fresh with new 'from'
    if (range?.from && range?.to && newRange.from && newRange.to) {
        onRangeChange({ from: newRange.to, to: null });
        return;
    }

    // If 'to' is now selected (different from 'from'), we have a complete range - close
    if (newRange.from && newRange.to) {
        onRangeChange(newRange);
    } else {
        // Only 'from' is selected, keep popover open
        onRangeChange(newRange);
    }
}

export default handleRangeSelect
