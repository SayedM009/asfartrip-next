"use client";

export default function Error({ error }) {
    console.error("🔥 Runtime Error:", error);
    return <div>Something went wrong {error.message} </div>;
}
