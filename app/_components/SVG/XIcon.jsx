// components/icons/XIcon.jsx
export default function XIcon({ size = 24, className = "" }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
        >
            <path d="M18.39 1.73h3.29l-7.18 8.21 8.46 12.33h-6.63l-5.19-7.49-5.94 7.49H1.85l7.67-8.64-8.2-11.9h6.72l4.71 6.82 5.64-6.82zm-1.15 19.68h1.82L6.67 3.3H4.7l12.54 18.11z" />
        </svg>
    );
}
