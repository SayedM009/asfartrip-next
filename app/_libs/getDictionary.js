import fs from "fs";
import path from "path";

export async function getDictionary(locale) {
    const filePath = path.resolve("./app/_messages", `${locale}.json`);

    try {
        const file = await fs.promises.readFile(filePath, "utf-8");
        return JSON.parse(file);
    } catch (err) {
        console.error(`Missing translation file for locale: ${locale}`);
        // fallback to English
        const fallback = await fs.promises.readFile(
            path.resolve("./app/_messages/en.json"),
            "utf-8"
        );
        return JSON.parse(fallback);
    }
}
