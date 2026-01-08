function calculatePassengers(request) {
    const parsedRequest = JSON.parse(request)
    const passengers = {
        adults: parsedRequest.adults,
        children: parsedRequest.children,
        seniors: parsedRequest.seniors
    }
    const totalPassengers = Number(passengers.adults) +
        Number(passengers.children) +
        Number(passengers.seniors);

    return { passengers, totalPassengers };
}

export default calculatePassengers
