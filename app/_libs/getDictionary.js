import fs from "fs";
import path from "path";

export async function getDictionary(locale) {
    const filePath = path.resolve("./app/_messages", `${locale}.json`);
    const file = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(file);
}
