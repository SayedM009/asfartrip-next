export function incrementPassenger(type, setPassengers) {
    setPassengers((prev) => {
        if (prev[type] >= 50) return prev;
        return {
            ...prev,
            [type]: prev[type] + 1,
        };
    });
}