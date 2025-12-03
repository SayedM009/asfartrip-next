"use client";

export default function GlobalError({ error, reset }) {
    console.error("🔥 Server Component Error:", error);

    return (
        <html>
            <body>
                <h2>Something went wrong.</h2>
                <pre style={{ whiteSpace: "pre-wrap", color: "red" }}>
                    {error?.stack}
                    {error?.name}
                    {error?.message}
                    {error?.digest ?? "No digest found"}
                </pre>

                <button onClick={() => reset()}>Try again</button>
            </body>
        </html>
    );
}
