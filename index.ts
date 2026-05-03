// index.ts
import jwt from "jsonwebtoken";

const SECRET = "devops-secret";

export const server = Bun.serve({
  port: 3000,
  hostname: "0.0.0.0",

  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path === "/health") {
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (path === "/login" && req.method === "POST") {
      const body = await req.json();
      const token = jwt.sign({ user: body.username }, SECRET);

      return new Response(JSON.stringify({ token }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (path === "/protected") {
      const auth = req.headers.get("authorization");

      if (!auth || !auth.startsWith("Bearer ")) {
        return new Response("Unauthorized", { status: 401 });
      }

      try {
        const token = auth.split(" ")[1];
        jwt.verify(token, SECRET);

        return new Response(JSON.stringify({ message: "Access granted" }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch {
        return new Response("Forbidden", { status: 403 });
      }
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`Server running on http://localhost:${server.port}`);