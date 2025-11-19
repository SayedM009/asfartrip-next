// app/_modules/offers/components/atoms/OfferTag.jsx

export default function OfferTag({ label }) {
    if (!label) return null;

    return (
        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium">
            {label}
        </span>
    );
}
