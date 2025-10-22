const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const WebSocket = require("ws");
require("dotenv").config();

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const app = next({ dev, hostname });
const handle = app.getRequestHandler();

class WebSocketManager {
  constructor() {
    this.wss = null;
    this.clients = new Map(); // Change to Map to store client with user info
    this.heartbeatInterval = null;
  }

  init(server) {
    if (this.wss) return; // Already initialized

    this.wss = new WebSocket.Server({
      noServer: true, // Don't attach to server automatically to avoid conflicts with Next.js
      perMessageDeflate: false, // Disable compression to avoid memory issues
      maxPayload: 1024 * 1024, // 1MB max payload
    });

    // Manually handle WebSocket upgrades to avoid conflicts with Next.js
    server.on("upgrade", (request, socket, head) => {
      // Check if this is a WebSocket upgrade request
      if (
        request.headers.upgrade &&
        request.headers.upgrade.toLowerCase() === "websocket"
      ) {
        this.wss.handleUpgrade(request, socket, head, (ws) => {
          this.wss.emit("connection", ws, request);
        });
      } else {
        // Not a WebSocket request, destroy the socket
        socket.destroy();
      }
    });

    this.wss.on("connection", (ws, request) => {
      console.log("New WebSocket connection established");

      // Initialize client info - will be updated when user authenticates
      const clientInfo = {
        ws,
        userId: null,
        role: null,
        isAuthenticated: false,
      };

      this.clients.set(ws, clientInfo);

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
          } else if (message.type === "authenticate") {
            // Handle authentication message
            const clientInfo = this.clients.get(ws);
            if (clientInfo && message.userId && message.role) {
              clientInfo.userId = message.userId;
              clientInfo.role = message.role;
              clientInfo.isAuthenticated = true;
              console.log(
                `WebSocket client authenticated: ${message.userId} (${message.role})`
              );
            }
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
    let adminCount = 0;

    this.clients.forEach((clientInfo, ws) => {
      if (
        ws.readyState === WebSocket.OPEN &&
        clientInfo.isAuthenticated &&
        clientInfo.role === "admin"
      ) {
        // Send only to authenticated admin clients
        ws.send(message);
        adminCount++;
      }
    });

    console.log(`New booking notification sent to ${adminCount} admin(s)`);
  }

  getClientCount() {
    return this.clients.size;
  }
}

const wsManager = new WebSocketManager();

const startServer = async () => {
  await app.prepare();

  // Connect to MongoDB
  try {
    const connectDB = require("./lib/mongodb");
    await connectDB();
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }

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
    console.log(`> MongoDB backend connected`);
    console.log(`> WebSocket manager available: ${!!global.wsManager}`);
  });
};

startServer();

module.exports = { wsManager };
