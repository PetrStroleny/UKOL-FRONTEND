import fs from "fs";

export async function returnJSONFromFile(url, res) {
    const data = fs.readFileSync(`${url}.json`, "utf8");
    return await JSON.parse(data);
}