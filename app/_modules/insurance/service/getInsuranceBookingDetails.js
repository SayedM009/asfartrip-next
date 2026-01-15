/**
 * Get Insurance Booking Details
 * Fetches the full booking details for display on the status page
 */

// Mock data for development (until API is ready)
const MOCK_INSURANCE_BOOKING = {
    status: 'success',
    data: {
        order_id: 'AFT01IP8TEYEJN',
        policy_number: 'POL-2026-001234',
        date: '2026-01-13',
        currency: 'AED',
        premium: '45.00',
        VAT: '2.25',
        TotalPrice: '55.00',
        customer_name: 'Ahmed Ali',
        phone: '+971501234567',
        email: 'ahmed@example.com',
        insurance_quote: JSON.stringify({
            scheme: {
                name: 'Standard Traveler',
                benefits: [
                    { cover: 'Emergency Medical Expenses', amount: 'AED 100,000' },
                    { cover: 'Trip Cancellation', amount: 'AED 5,000' },
                    { cover: 'Lost Baggage', amount: 'AED 2,000' },
                    { cover: 'Travel Delay', amount: 'AED 500' },
                    { cover: 'Personal Liability', amount: 'AED 50,000' },
                    { cover: 'Dental Treatment', amount: 'Not Covered' },
                ]
            }
        }),
        TravelerDetails: [
            {
                title: 'Mr',
                firstName: 'Ahmed',
                lastName: 'Ali',
                passportNumber: 'A12345678',
                nationality: 'UAE',
                dob: '1990-05-15',
                expiry: '2026-01-20'
            }
        ]
    }
};

/**
 * Fetch insurance booking details by order ID
 * @param {string} orderId - The order/booking reference
 * @returns {Promise<object>} Booking details
 */
export async function getInsuranceBookingDetails(orderId) {
    // For development - return mock data
    // TODO: Replace with actual API call when ready
    const USE_MOCK = true;

    if (USE_MOCK) {
        console.log('[DEV] Using mock insurance booking data for order:', orderId);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            ...MOCK_INSURANCE_BOOKING,
            data: {
                ...MOCK_INSURANCE_BOOKING.data,
                order_id: orderId || MOCK_INSURANCE_BOOKING.data.order_id
            }
        };
    }

    // Actual API call (for when API is ready)
    try {
        const response = await fetch('/api/insurance/booking-details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderId }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch insurance booking details');
        }

        return await response.json();
    } catch (error) {
        console.error('getInsuranceBookingDetails error:', error);
        throw error;
    }
}

/**
 * Parse insurance booking data for display
 * @param {object} bookingData - Raw booking data from API
 * @returns {object} Parsed data ready for display
 */
export function parseInsuranceBookingData(bookingData) {
    if (!bookingData) return null;

    // Parse the insurance quote JSON
    let insuranceQuote;
    try {
        insuranceQuote = typeof bookingData.insurance_quote === 'string'
            ? JSON.parse(bookingData.insurance_quote)
            : bookingData.insurance_quote;
    } catch (e) {
        console.error('Failed to parse insurance_quote:', e);
        insuranceQuote = { scheme: { name: 'Unknown', benefits: [] } };
    }

    const scheme = insuranceQuote?.scheme || { name: 'Unknown', benefits: [] };

    // Extract coverage details from benefits (filter out "Not Covered")
    const coverageDetails = (scheme.benefits || [])
        .filter(benefit => !benefit.amount?.includes('Not Covered') && benefit.amount)
        .slice(0, 5)
        .map(benefit => ({
            name: benefit.cover,
            value: benefit.amount,
        }));

    // Calculate duration
    const startDate = new Date(bookingData.date);
    const endDate = bookingData.TravelerDetails?.[0]?.expiry
        ? new Date(bookingData.TravelerDetails[0].expiry)
        : null;
    const durationDays = endDate
        ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
        : 0;

    // Determine trip type and formatted duration
    const getTripTypeAndDuration = (days) => {
        if (days >= 730) {
            const years = Math.round(days / 365);
            return {
                tripType: 'multiYear',
                durationText: `${years}`,
                durationUnit: 'years'
            };
        } else if (days >= 350 && days <= 380) {
            return {
                tripType: 'annual',
                durationText: '1',
                durationUnit: 'year'
            };
        } else if (days >= 180) {
            const months = Math.round(days / 30);
            return {
                tripType: 'extended',
                durationText: `${months}`,
                durationUnit: 'months'
            };
        } else {
            return {
                tripType: 'single',
                durationText: `${days}`,
                durationUnit: 'days'
            };
        }
    };

    const { tripType, durationText, durationUnit } = getTripTypeAndDuration(durationDays);

    return {
        policy: {
            title: scheme.name,
            subtitle: 'Travel Insurance Policy',
            policyNumber: bookingData.policy_number || 'Pending',
            effectiveDate: startDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
            expiryDate: endDate
                ? endDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })
                : 'N/A',
            durationDays,
            durationText,
            durationUnit,
            tripType,
        },
        paymentDetails: [
            { label: 'Premium', value: `${bookingData.currency || 'AED'} ${bookingData.premium || '0.00'}` },
            { label: 'VAT', value: `${bookingData.currency || 'AED'} ${bookingData.VAT || '0.00'}` },
            { label: 'Total', value: `${bookingData.currency || 'AED'} ${bookingData.TotalPrice || '0.00'}`, isTotal: true },
        ],
        coverageDetails,
        contactInfo: {
            name: bookingData.customer_name || 'N/A',
            phone: bookingData.phone || 'N/A',
            email: bookingData.email || 'N/A',
        },
        travelerDetails: (bookingData.TravelerDetails || []).map(traveler => ({
            name: `${traveler.title || ''} ${traveler.firstName || ''} ${traveler.lastName || ''}`.trim(),
            passport: traveler.passportNumber || 'N/A',
            nationality: traveler.nationality || 'N/A',
            dob: traveler.dob
                ? new Date(traveler.dob).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })
                : 'N/A',
        })),
        orderId: bookingData.order_id,
    };
}
