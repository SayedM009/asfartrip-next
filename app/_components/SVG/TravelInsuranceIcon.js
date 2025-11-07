"use client";

export default function TravelInsuranceIcon() {
    return (
        <svg
            width="140"
            height="140"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* الخلفية الرمادية */}
            <circle cx="40" cy="40" r="32" fill="#F2F2F2" />

            {/* الدرع */}
            <path
                d="M40 20C40 20 28 22 28 34C28 48 40 60 40 60C40 60 52 48 52 34C52 22 40 20 40 20Z"
                fill="white"
                stroke="#999999"
                strokeWidth="2"
                strokeLinejoin="round"
            />

            {/* رمز الطيارة داخل الدرع */}
            <path
                d="M46 38L41 37V30.5C41 29.67 40.33 29 39.5 29C38.67 29 38 29.67 38 30.5V37L33 38C32.45 38.1 32 38.55 32 39.1C32 39.65 32.45 40.1 33 40L38 41V44L36.5 45C36.2 45.2 36 45.55 36 46C36 46.55 36.45 47 37 47H42C42.55 47 43 46.55 43 46C43 45.55 42.8 45.2 42.5 45L41 44V41L46 40C46.55 39.9 47 39.45 47 38.9C47 38.35 46.55 38 46 38Z"
                fill="#999999"
            />

            {/* ظل خفيف في الأسفل */}
            <ellipse
                cx="40"
                cy="67"
                rx="15"
                ry="2"
                fill="#E0E0E0"
                opacity="0.6"
            />
        </svg>
    );
}
