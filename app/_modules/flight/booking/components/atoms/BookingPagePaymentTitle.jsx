function BookingPagePaymentTitle({ t }) {
    return (
        <h2 className=" capitalize  font-semibold text-lg sm:text-xl">
            {t("select_payment_method")}
        </h2>
    );
}

export default BookingPagePaymentTitle;
