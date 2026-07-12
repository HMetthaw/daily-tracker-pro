import http from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, resolve, sep } from "node:path";

const root = join(process.cwd(), "pwa");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml"
};

const server = http.createServer((request, response) => {
  const requestPath = decodeURIComponent(new URL(request.url, `http://localhost:${port}`).pathname);
  const relativePath = requestPath.replace(/^[/\\]+/, "") || "index.html";
  const filePath = resolve(root, relativePath);
  const staysInsideRoot = filePath === root || filePath.startsWith(`${root}${sep}`);
  if (!staysInsideRoot) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }
  const target = existsSync(filePath) && statSync(filePath).isFile() ? filePath : join(root, "index.html");
  response.writeHead(200, { "Content-Type": types[extname(target)] || "application/octet-stream" });
  createReadStream(target).pipe(response);
});

server.listen(port, () => {
  console.log(`PWA running at http://localhost:${port}`);
});
