function BookingPagePaymentSubTitle({ t }) {
    return (
        <p className="capitalize flex items-center gap-2 text-xs text-muted-foreground truncate">
            {t("secured_payments")}
        </p>
    );
}

export default BookingPagePaymentSubTitle;
