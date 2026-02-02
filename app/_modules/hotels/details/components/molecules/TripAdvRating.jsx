import Image from "next/image";

function TripAdvRating({
    tripAdvisorRating,
    parentClass = "",
    ratingClass = "",
    imageSize = 25,
    showLabel = false,
}) {
    if (!tripAdvisorRating) return null;

    // تحديد النص بناء على التقييم
    const getRatingLabel = (rating) => {
        const numRating = parseFloat(rating);
        if (numRating >= 4.5) return "Excellent";
        if (numRating >= 4) return "Very Good";
        if (numRating >= 3.5) return "Good";
        if (numRating >= 3) return "Average";
        return "Poor";
    };

    return (
        <div
            className={`flex items-center gap-2 text-xs sm:text-sm mb-2 ${parentClass}`}
        >
            <span
                className={`bg-[#34e0a1] dark:bg-green-900 text-white px-1.5 py-0 rounded-full rounded-tr-none font-semibold ${ratingClass}`}
            >
                {tripAdvisorRating} / 5
            </span>

            {showLabel && (
                <span className="font-bold text-[#34e0a1] text-lg">
                    {getRatingLabel(tripAdvisorRating)}
                </span>
            )}

            <Image
                src="/hotels/owl.svg"
                alt="TripAdvisor"
                width={imageSize}
                height={imageSize}
            />
        </div>
    );
}

export default TripAdvRating;
