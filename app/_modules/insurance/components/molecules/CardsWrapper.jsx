import InsuranceCard from "./InsuranceCard";

export default function CardsWrapper({ data }) {
    if (!data) return null;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {data.map((quote, index) => (
                <InsuranceCard key={index} quote={quote} />
            ))}
        </div>
    );
}
