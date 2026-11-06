import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../dist/", import.meta.url));
const args = process.argv.slice(2);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

try {
  if (args.length !== 0 && (args.length !== 2 || args[0] !== "--port")) {
    throw new Error("Usage: node scripts/serve.mjs [--port NUMBER]");
  }
  const port = args.length === 0 ? 4173 : Number(args[1]);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("Choose a port between 1 and 65535.");
  }
  let missingPage;
  try {
    missingPage = await readFile(join(root, "404.html"));
  } catch (error) {
    if (error.code === "ENOENT") throw new Error("The built website is missing. Run npm run build first.", { cause: error });
    throw error;
  }

  const server = createServer(async (request, response) => {
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Cache-Control", "no-store");
    const send = (status, content, type = "text/plain; charset=utf-8") => {
      response.writeHead(status, { "Content-Type": type });
      response.end(request.method === "HEAD" ? undefined : content);
    };
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.setHeader("Allow", "GET, HEAD");
      request.resume();
      send(405, "This preview only supports GET and HEAD requests.");
      return;
    }
    try {
      let pathname;
      let url;
      try {
        url = new URL(request.url, "http://127.0.0.1");
        pathname = decodeURIComponent(url.pathname);
        if (pathname.includes("\0")) throw new URIError("A URL cannot contain a null byte.");
      } catch (error) {
        if (error instanceof URIError || error instanceof TypeError) {
          send(400, "The requested URL is invalid.");
          return;
        }
        throw error;
      }
      let path = resolve(root, `.${pathname}`);
      if (path !== resolve(root) && !path.startsWith(`${resolve(root)}${sep}`)) {
        send(404, missingPage, types[".html"]);
        return;
      }
      try {
        if ((await stat(path)).isDirectory()) {
          if (!url.pathname.endsWith("/")) {
            response.writeHead(301, { Location: `${url.pathname}/${url.search}` });
            response.end();
            return;
          }
          path = join(path, "index.html");
        }
        const content = await readFile(path);
        send(200, content, types[extname(path)] ?? "application/octet-stream");
      } catch (error) {
        if (error.code === "ENOENT" || error.code === "ENOTDIR") {
          send(404, missingPage, types[".html"]);
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error("Preview request failed:", error);
      send(500, "The preview could not read this website file. Check the server output.");
    }
  });
  server.on("error", (error) => {
    console.error("Preview server failed:", error);
    process.exitCode = 1;
  });
  server.listen(port, "127.0.0.1", () => console.log(`Moguri preview: http://127.0.0.1:${port}`));
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.once(signal, () => server.close());
  }
} catch (error) {
  console.error("Preview server failed:", error);
  process.exitCode = 1;
}
