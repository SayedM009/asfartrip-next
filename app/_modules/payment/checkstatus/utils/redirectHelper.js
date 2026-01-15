/**
 * Redirect Helper
 * ================
 * Builds redirect URLs for different payment modules using the registry.
 */

import { getModuleConfig } from '../registry/moduleRegistry';

/**
 * Build redirect URL based on module type
 * @param {string} module - Module name (FLIGHT, INSURANCE, etc.)
 * @param {object} paymentData - Payment data from check payment
 * @param {object} confirmData - Confirm booking response
 * @param {object} issueData - Issue ticket/policy response
 * @param {string} gateway - Payment gateway used
 * @param {boolean} isPending - Whether the status is pending
 * @returns {object} { path, params }
 */
export function buildStatusRedirectUrl(module, paymentData, confirmData, issueData, gateway, isPending = false) {
    const moduleConfig = getModuleConfig(module);

    // Common parameters for all modules
    const commonParams = {
        order_id: paymentData?.order_id || '',
        booking_ref: paymentData?.booking_ref || '',
        module: moduleConfig.name.toLowerCase(),
        gateway: gateway || '',
        transaction_id: paymentData?.gateway_response?.id || paymentData?.gateway_response?.transaction_id || '',
        amount: paymentData?.amount || paymentData?.gateway_response?.amount || '',
        currency: paymentData?.currency || paymentData?.gateway_response?.currency || '',
        payment_status: paymentData?.payment_status || 'completed',
        card_type: paymentData?.card_type || '',
        card_last4: paymentData?.card_last4 || '',
        transaction_date: paymentData?.transaction_date || '',
    };

    if (isPending) {
        commonParams.pending = 'true';
    }

    // Get module-specific params from registry
    const moduleSpecificParams = moduleConfig.getRedirectParams
        ? moduleConfig.getRedirectParams(confirmData, issueData)
        : {};

    return {
        path: moduleConfig.statusPage,
        params: {
            ...commonParams,
            ...moduleSpecificParams,
        }
    };
}

/**
 * Build URL string from redirect config
 * @param {object} redirectConfig - { path, params }
 * @returns {string} Full URL string
 */
export function buildRedirectUrlString(redirectConfig) {
    const params = new URLSearchParams(redirectConfig.params);
    return `${redirectConfig.path}?${params.toString()}`;
}
