import fs from "fs";
const size = 50 * 1024 * 1024; // 50MB
const str = "a".repeat(size);
try {
  const json = JSON.stringify({ data: str });
  console.log("Stringify succeeded, length:", json.length);
} catch (e) {
  console.error("Stringify failed", e);
}
