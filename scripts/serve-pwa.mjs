import http from "node:http";
import { createReadStream, existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";

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
  const cleanPath = normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(root, cleanPath === "/" ? "index.html" : cleanPath);
  const target = existsSync(filePath) ? filePath : join(root, "index.html");
  response.writeHead(200, { "Content-Type": types[extname(target)] || "application/octet-stream" });
  createReadStream(target).pipe(response);
});

server.listen(port, () => {
  console.log(`PWA running at http://localhost:${port}`);
});
