export function decrementPassenger(type, setPassengers) {
    setPassengers((prev) => {
        if (prev[type] <= 0) return prev;
        if (prev[type] === 1 && type === "adults") return prev;
        return {
            ...prev,
            [type]: prev[type] - 1,
        };
    });
}