import { createServer } from "http";
import next from "next";
import { parse } from "url";
import createWebSocketServer from "./src/server/websocket";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// For Vercel serverless deployment
export const config = {
  api: {
    bodyParser: false,
  },
};

const server = createServer((req, res) => {
  void (async () => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  })();
});

// Initialize WebSocket server
createWebSocketServer(server);

if (dev) {
  // Development: Start local server
  void app.prepare().then(() => {
    server.listen(port, () => {
      console.log(
        `> Server listening at http://${hostname}:${port} as ${
          dev ? "development" : process.env.NODE_ENV
        }`
      );
    });
  });
}

// Export the server instance for production (Vercel)
export default server; 