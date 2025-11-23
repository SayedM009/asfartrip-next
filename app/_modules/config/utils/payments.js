export function getActivePaymentGateways(list = []) {
    return list.filter((gw) => gw.is_active === "1");
}

export function getActiveCards(list = []) {
    return list.filter((card) => card.is_active === "1");
}
