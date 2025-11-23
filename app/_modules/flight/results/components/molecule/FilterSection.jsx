// app/_modules/flights/results/filters/components/FilterSection.jsx

"use client";

export default function FilterSection({ title, children }) {
    return (
        <section className="mb-5">
            <h3 className="font-semibold text-sm mb-3">{title}</h3>
            <div className="space-y-3">{children}</div>
        </section>
    );
}
