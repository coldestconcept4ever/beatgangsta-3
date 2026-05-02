import { getUnifiedRecipeSchema } from './src/services/geminiService.ts';

function checkNode(node: any, path: string = "root") {
    if (!node || typeof node !== "object") return;

    if (node.type === "ARRAY" && !node.items) {
        console.error(`ERROR: Node at ${path} is of type ARRAY but missing 'items'`);
        process.exitCode = 1;
    }

    if (node.properties && node.type !== "OBJECT") {
        console.error(`ERROR: Node at ${path} has properties but is not type OBJECT`);
        process.exitCode = 1;
    }

    // recurse
    for (const key in node) {
        if (typeof node[key] === "object") {
            checkNode(node[key], `${path}.${key}`);
        }
    }
}

try {
    const schema = getUnifiedRecipeSchema();
    checkNode(schema);
    console.log("Schema validation check completed!");
} catch (e: any) {
    console.error("FATAL: ", e.message);
    process.exitCode = 1;
}
