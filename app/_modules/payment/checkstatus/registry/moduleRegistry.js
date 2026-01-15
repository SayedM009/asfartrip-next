/**
 * Payment Module Registry
 * ========================
 * Central configuration for all payment modules (Flight, Insurance, Hotels, etc.)
 * 
 * To add a new module:
 * 1. Add the module configuration object below
 * 2. Create the API routes for confirm/issue
 * 3. Create the status page component
 * 4. Add translations
 * 
 * That's it! The payment flow will automatically handle the new module.
 */

// ============================================
//  Module Configuration
// ============================================

const MODULES = {
    FLIGHT: {
        name: 'FLIGHT',
        displayName: 'Flight',

        // API endpoints (called from confirmBookingService)
        endpoints: {
            confirm: '/api/flight/confirmbooking',
            issue: '/api/flight/issueticket',
        },

        // Status page path (used by redirectHelper)
        statusPage: '/flights/status/success',

        // How to check if issuance was successful
        isIssueSuccess: (issueData) => {
            const ticketStatus = issueData?.data?.ticket_status?.toUpperCase();
            const ticketNumbers = issueData?.data?.ticket_numbers;
            return ticketStatus === 'CREATED' && ticketNumbers === 'Yes';
        },

        // Extra params for redirect URL
        getRedirectParams: (confirmData, issueData) => ({
            PNR: confirmData?.PNR || issueData?.data?.PNR || '',
        }),

        // Translation keys
        translations: {
            issueSuccess: 'ticketIssuedRedirecting',
            alreadyIssued: 'ticketAlreadyIssuedRedirecting',
            pending: 'paymentReceivedTicketPending',
        },
    },

    INSURANCE: {
        name: 'INSURANCE',
        displayName: 'Insurance',

        endpoints: {
            confirm: '/api/insurance/confirm',
            issue: '/api/insurance/purchase',
        },

        statusPage: '/insurance/status/success',

        isIssueSuccess: (issueData) => {
            return issueData?.success || issueData?.data?.policy_id;
        },

        getRedirectParams: (confirmData, issueData) => ({
            policy_id: issueData?.data?.policy_id || confirmData?.policy_id || '',
        }),

        translations: {
            issueSuccess: 'policyPurchasedRedirecting',
            alreadyIssued: 'policyAlreadyPurchasedRedirecting',
            pending: 'paymentReceivedPolicyPending',
        },
    },

    // ============================================
    //  Add new modules here (e.g., HOTEL)
    // ============================================
    // HOTEL: {
    //     name: 'HOTEL',
    //     displayName: 'Hotel',
    //     endpoints: {
    //         confirm: '/api/hotel/confirm',
    //         issue: '/api/hotel/voucher',
    //     },
    //     statusPage: '/hotels/status/success',
    //     isIssueSuccess: (issueData) => issueData?.data?.confirmation_number,
    //     getRedirectParams: (confirmData, issueData) => ({
    //         confirmation_number: issueData?.data?.confirmation_number || '',
    //     }),
    //     translations: {
    //         issueSuccess: 'voucherIssuedRedirecting',
    //         alreadyIssued: 'voucherAlreadyIssuedRedirecting',
    //         pending: 'paymentReceivedVoucherPending',
    //     },
    // },
};

// ============================================
//  Helper Functions
// ============================================

/**
 * Get module configuration by name
 * @param {string} moduleName - Module name (FLIGHT, INSURANCE, etc.)
 * @returns {object} Module configuration or FLIGHT as default
 */
export function getModuleConfig(moduleName) {
    const normalizedName = moduleName?.toUpperCase();
    return MODULES[normalizedName] || MODULES.FLIGHT;
}

/**
 * Get list of all registered modules
 * @returns {string[]} Array of module names
 */
export function getRegisteredModules() {
    return Object.keys(MODULES);
}

/**
 * Check if a module is registered
 * @param {string} moduleName - Module name to check
 * @returns {boolean}
 */
export function isModuleRegistered(moduleName) {
    return !!MODULES[moduleName?.toUpperCase()];
}

// Export the modules object for direct access if needed
export { MODULES };
