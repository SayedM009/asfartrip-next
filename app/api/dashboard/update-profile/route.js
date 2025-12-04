export async function POST(req) {
    try {
        const bodyText = await req.text();
        const params = new URLSearchParams(bodyText);

        const formBody = {};
        for (const [key, value] of params.entries()) {
            formBody[key] = value;
        }

        const username = process.env.TP_USERNAME;
        const password = process.env.TP_PASSWORD;
        const baseUrl = process.env.API_BASE_URL;

        const basicAuth = btoa(`${username}:${password}`);

        const apiRes = await fetch(`${baseUrl}_profile`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${basicAuth}`,
            },
            body: new URLSearchParams(formBody).toString(),
        });

        const data = await apiRes.json();
        return new Response(JSON.stringify(data), { status: apiRes.status });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Internal error", error: error.message }),
            { status: 500 }
        );
    }
}
