const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const WebSocket = require("ws");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const app = next({ dev, hostname });
const handle = app.getRequestHandler();

class WebSocketManager {
  constructor() {
    this.wss = null;
    this.clients = new Set();
    this.heartbeatInterval = null;
  }

  init(server) {
    if (this.wss) return; // Already initialized

    this.wss = new WebSocket.Server({
      server,
      perMessageDeflate: false, // Disable compression to avoid memory issues
      maxPayload: 1024 * 1024, // 1MB max payload
      // Add heartbeat settings
      heartbeat: {
        interval: 30000, // 30 seconds
        timeout: 5000, // 5 seconds timeout
      },
    });

    this.wss.on("connection", (ws, request) => {
      console.log("New WebSocket connection established");
      this.clients.add(ws);

      // Send initial connection confirmation
      ws.send(
        JSON.stringify({
          type: "connected",
          message: "WebSocket connected successfully",
        })
      );

      // Handle pong responses to keep connection alive
      ws.on("pong", () => {
        ws.isAlive = true;
      });

      ws.on("close", (code, reason) => {
        console.log(`WebSocket connection closed with code: ${code}`);
        this.clients.delete(ws);
        ws.isAlive = false;
      });

      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
        this.clients.delete(ws);
        ws.isAlive = false;
      });

      ws.on("message", (data) => {
        try {
          const message = JSON.parse(data.toString());
          if (message.type === "ping") {
            ws.send(JSON.stringify({ type: "pong" }));
          }
        } catch (error) {
          // Ignore invalid messages
        }
      });

      // Mark connection as alive
      ws.isAlive = true;
    });

    // Start heartbeat check every 30 seconds
    this.startHeartbeat();

    console.log("WebSocket server initialized with stable connection support");
  }

  startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        if (!ws.isAlive) {
          console.log("Terminating dead WebSocket connection");
          ws.terminate();
          this.clients.delete(ws);
          return;
        }

        ws.isAlive = false;
        ws.ping();
      });
    }, 30000); // Check every 30 seconds
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  notifyNewBooking(booking) {
    const notification = {
      type: "new_booking",
      booking,
    };

    const message = JSON.stringify(notification);

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });

    console.log(
      "New booking notification sent to",
      this.clients.size,
      "clients"
    );
  }

  getClientCount() {
    return this.clients.size;
  }
}

const wsManager = new WebSocketManager();

const startServer = async () => {
  await app.prepare();

  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Initialize WebSocket server
  wsManager.init(server);

  // Make wsManager globally available after initialization
  global.wsManager = wsManager;

  const port =
    process.env.PORT || (process.argv.includes("--admin") ? 3001 : 3000);

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
    console.log(`> WebSocket server initialized for real-time notifications`);
    console.log(`> WebSocket manager available: ${!!global.wsManager}`);
  });
};

startServer();

module.exports = { wsManager };
