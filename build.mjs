import { cp, mkdir, rm } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/server", { recursive: true });
await mkdir("dist/client", { recursive: true });
await cp("index.html", "dist/client/index.html");
await cp("worker.js", "dist/server/index.js");
console.log("Built the static website for hosting.");
