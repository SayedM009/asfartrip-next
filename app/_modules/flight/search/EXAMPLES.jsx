/**
 * EXAMPLE: How to use the new refactored components
 * This file demonstrates the usage of atoms, molecules, and organisms
 */

import { useState } from 'react';
import { 
    TripTypeSelector,
    ClassSelector,
    PassengerSelector 
} from './components/molecules';
import { PassengerClassPicker } from './components/organisms';
import { usePassengerLogic } from './hooks/usePassengerLogic';
import { TRIP_TYPES, CABIN_CLASSES } from './constants';

// ============================================
// EXAMPLE 1: Using Molecules Separately
// ============================================
export function Example1_SeparateMolecules() {
    const [tripType, setTripType] = useState(TRIP_TYPES.ROUND_TRIP);
    const [travelClass, setTravelClass] = useState('Economy');
    const { passengers, updatePassengers } = usePassengerLogic();

    return (
        <div className="space-y-4">
            {/* Trip Type Selector */}
            <TripTypeSelector 
                tripType={tripType} 
                setTripType={setTripType} 
            />

            {/* Class Selector */}
            <ClassSelector 
                value={travelClass}
                onChange={setTravelClass}
            />

            {/* Passenger Selector */}
            <PassengerSelector
                passengers={passengers}
                onUpdate={updatePassengers}
            />
        </div>
    );
}

// ============================================
// EXAMPLE 2: Using Complete Organism
// ============================================
export function Example2_CompleteOrganism() {
    const [tripType, setTripType] = useState('roundtrip');
    const [travelClass, setTravelClass] = useState('Economy');
    const [passengers, setPassengers] = useState({
        adults: 1,
        children: 0,
        infants: 0
    });

    return (
        <div className="space-y-4">
            {/* Trip Type */}
            <TripTypeSelector 
                tripType={tripType} 
                setTripType={setTripType} 
            />

            {/* Passenger & Class (Combined) */}
            <PassengerClassPicker
                passengers={passengers}
                setPassengers={setPassengers}
                travelClass={travelClass}
                setTravelClass={setTravelClass}
                showLabel={true}
            />
        </div>
    );
}

// ============================================
// EXAMPLE 3: Using Custom Hook
// ============================================
export function Example3_WithCustomHook() {
    const { 
        passengers, 
        updatePassengers, 
        getTotalPassengers,
        resetPassengers 
    } = usePassengerLogic({ adults: 2, children: 1, infants: 0 });

    const totalCount = getTotalPassengers();

    return (
        <div>
            <p>Total Passengers: {totalCount}</p>
            
            <PassengerSelector
                passengers={passengers}
                onUpdate={updatePassengers}
            />

            <button onClick={resetPassengers}>
                Reset to Default
            </button>
        </div>
    );
}

// ============================================
// EXAMPLE 4: Using Constants
// ============================================
export function Example4_WithConstants() {
    const [tripType, setTripType] = useState(TRIP_TYPES.ONE_WAY);
    const [cabin, setCabin] = useState(CABIN_CLASSES.BUSINESS);

    // Type-safe comparison
    const isOneWay = tripType === TRIP_TYPES.ONE_WAY;
    const isBusiness = cabin === CABIN_CLASSES.BUSINESS;

    return (
        <div>
            <p>One Way Trip: {isOneWay ? 'Yes' : 'No'}</p>
            <p>Business Class: {isBusiness ? 'Yes' : 'No'}</p>
        </div>
    );
}

// ============================================
// EXAMPLE 5: Migration from Old Component
// ============================================

// OLD WAY (Still works!)
import PassengersAndClass from './components/desktop/PassengersAndClass';

export function OldWay() {
    const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
    const [travelClass, setTravelClass] = useState('Economy');

    return (
        <PassengersAndClass
            passengers={passengers}
            setPassengers={setPassengers}
            travelClass={travelClass}
            setTravelClass={setTravelClass}
            isLabel={true}
        />
    );
}

// NEW WAY (Recommended!)
export function NewWay() {
    const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
    const [travelClass, setTravelClass] = useState('Economy');

    return (
        <PassengerClassPicker
            passengers={passengers}
            setPassengers={setPassengers}
            travelClass={travelClass}
            setTravelClass={setTravelClass}
            showLabel={true}
        />
    );
}

// ============================================
// NOTES:
// ============================================
// 1. Both old and new components work side by side
// 2. Props are the same, making migration easy
// 3. New components are more modular and reusable
// 4. Constants provide type safety
// 5. Custom hooks separate logic from UI
