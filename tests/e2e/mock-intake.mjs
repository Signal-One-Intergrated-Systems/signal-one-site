// Local stand-in for the intake upstream. Records the last payloads at GET /received.
import http from "node:http";

const received = [];
http
  .createServer((req, res) => {
    if (req.method === "GET" && req.url === "/received") {
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify(received));
      return;
    }
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        received.push({ auth: req.headers.authorization, body: JSON.parse(body) });
      } catch {
        received.push({ auth: req.headers.authorization, body });
      }
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ message: "Mock upstream: received." }));
    });
  })
  .listen(4010);
