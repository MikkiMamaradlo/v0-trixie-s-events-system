import WebSocket from "ws";
import { WebSocketManager } from "../../server";

// Mock WebSocket server for testing
class MockWebSocketServer {
  clients = new Set();
  events = new Map();

  on(event, callback) {
    this.events.set(event, callback);
  }

  emit(event, ...args) {
    const callback = this.events.get(event);
    if (callback) {
      callback(...args);
    }
  }

  handleUpgrade(request, socket, head, callback) {
    const ws = new MockWebSocket();
    callback(ws);
    this.emit("connection", ws, request);
  }
}

class MockWebSocket {
  readyState = WebSocket.OPEN;
  isAlive = true;
  events = new Map();

  on(event, callback) {
    this.events.set(event, callback);
  }

  emit(event, ...args) {
    const callback = this.events.get(event);
    if (callback) {
      callback(...args);
    }
  }

  send(data) {
    this.lastSentMessage = data;
  }

  ping() {
    this.emit("pong");
  }

  terminate() {
    this.readyState = WebSocket.CLOSED;
    this.emit("close", 1000, "Terminated");
  }

  close() {
    this.readyState = WebSocket.CLOSED;
    this.emit("close", 1000, "Closed");
  }
}

class MockServer {
  events = new Map();

  on(event, callback) {
    this.events.set(event, callback);
  }

  emit(event, ...args) {
    const callback = this.events.get(event);
    if (callback) {
      callback(...args);
    }
  }
}

describe("WebSocketManager", () => {
  let wsManager: WebSocketManager;
  let mockServer: MockServer;
  let mockWSS: MockWebSocketServer;

  beforeEach(() => {
    wsManager = new WebSocketManager();
    mockServer = new MockServer();
    mockWSS = new MockWebSocketServer();
    // Mock the WebSocket.Server constructor
    (global as any).WebSocket = { OPEN: 1, CLOSED: 3 };
  });

  afterEach(() => {
    if (wsManager.heartbeatInterval) {
      clearInterval(wsManager.heartbeatInterval);
    }
  });

  describe("Initialization", () => {
    it("should initialize WebSocket server correctly", () => {
      const mockWSSInstance = {
        on: jest.fn(),
        handleUpgrade: jest.fn(),
      };

      // Mock WebSocket.Server
      const originalWSS = WebSocket.Server;
      (global as any).WebSocket.Server = jest.fn(() => mockWSSInstance);

      wsManager.init(mockServer as any);

      expect(wsManager.wss).toBeDefined();
      expect(mockWSSInstance.on).toHaveBeenCalledWith(
        "connection",
        expect.any(Function)
      );

      // Restore original
      (global as any).WebSocket.Server = originalWSS;
    });

    it("should not reinitialize if already initialized", () => {
      const mockWSSInstance = { on: jest.fn() };
      const originalWSS = WebSocket.Server;
      (global as any).WebSocket.Server = jest.fn(() => mockWSSInstance);

      wsManager.init(mockServer as any);
      const firstWSS = wsManager.wss;

      wsManager.init(mockServer as any);
      expect(wsManager.wss).toBe(firstWSS);
      (global as any).WebSocket.Server = originalWSS;
    });
  });

  describe("Connection Handling", () => {
    let mockWS: MockWebSocket;

    beforeEach(() => {
      mockWS = new MockWebSocket();
    });

    it("should handle new connections", () => {
      const mockWSSInstance = {
        on: jest.fn((event, callback) => {
          if (event === "connection") {
            callback(mockWS, { headers: { upgrade: "websocket" } });
          }
        }),
        handleUpgrade: jest.fn(),
        clients: new Set(),
      };

      const originalWSS = WebSocket.Server;
      (global as any).WebSocket.Server = jest.fn(() => mockWSSInstance);

      wsManager.init(mockServer as any);

      expect(wsManager.clients.has(mockWS)).toBe(true);
      expect(mockWS.lastSentMessage).toContain(
        "WebSocket connected successfully"
      );
      (global as any).WebSocket.Server = originalWSS;
    });

    it("should handle connection close", () => {
      const mockWSSInstance = {
        on: jest.fn((event, callback) => {
          if (event === "connection") {
            callback(mockWS, { headers: { upgrade: "websocket" } });
          }
        }),
        handleUpgrade: jest.fn(),
        clients: new Set([mockWS]),
      };

      const originalWSS = WebSocket.Server;
      (global as any).WebSocket.Server = jest.fn(() => mockWSSInstance);

      wsManager.init(mockServer as any);

      // Simulate close
      mockWS.emit("close", 1000, "Normal closure");

      expect(wsManager.clients.has(mockWS)).toBe(false);
      expect(mockWS.isAlive).toBe(false);
      (global as any).WebSocket.Server = originalWSS;
    });

    it("should handle connection errors", () => {
      const mockWSSInstance = {
        on: jest.fn((event, callback) => {
          if (event === "connection") {
            callback(mockWS, { headers: { upgrade: "websocket" } });
          }
        }),
        handleUpgrade: jest.fn(),
        clients: new Set([mockWS]),
      };

      const originalWSS = WebSocket.Server;
      (global as any).WebSocket.Server = jest.fn(() => mockWSSInstance);

      wsManager.init(mockServer as any);

      // Simulate error
      mockWS.emit("error", new Error("Connection error"));

      expect(wsManager.clients.has(mockWS)).toBe(false);
      expect(mockWS.isAlive).toBe(false);
      (global as any).WebSocket.Server = originalWSS;
    });

    it("should handle pong responses", () => {
      const mockWSSInstance = {
        on: jest.fn((event, callback) => {
          if (event === "connection") {
            callback(mockWS, { headers: { upgrade: "websocket" } });
          }
        }),
        handleUpgrade: jest.fn(),
        clients: new Set([mockWS]),
      };

      const originalWSS = WebSocket.Server;
      (global as any).WebSocket.Server = jest.fn(() => mockWSSInstance);

      wsManager.init(mockServer as any);

      mockWS.isAlive = false;
      mockWS.emit("pong");

      expect(mockWS.isAlive).toBe(true);
      (global as any).WebSocket.Server = originalWSS;
    });

    it("should handle ping messages", () => {
      const mockWSSInstance = {
        on: jest.fn((event, callback) => {
          if (event === "connection") {
            callback(mockWS, { headers: { upgrade: "websocket" } });
          }
        }),
        handleUpgrade: jest.fn(),
        clients: new Set([mockWS]),
      };

      const originalWSS = WebSocket.Server;
      (global as any).WebSocket.Server = jest.fn(() => mockWSSInstance);

      wsManager.init(mockServer as any);

      const pingMessage = JSON.stringify({ type: "ping" });
      mockWS.emit("message", Buffer.from(pingMessage));

      expect(mockWS.lastSentMessage).toBe(JSON.stringify({ type: "pong" }));
      (global as any).WebSocket.Server = originalWSS;
    });
  });

  describe("Heartbeat Mechanism", () => {
    it("should start heartbeat checks", () => {
      const mockWSSInstance = {
        on: jest.fn(),
        handleUpgrade: jest.fn(),
        clients: new Set(),
      };

      const originalWSS = WebSocket.Server;
      (global as any).WebSocket.Server = jest.fn(() => mockWSSInstance);

      wsManager.init(mockServer as any);

      expect(wsManager.heartbeatInterval).toBeDefined();
      (global as any).WebSocket.Server = originalWSS;
    });

    it("should terminate dead connections during heartbeat", () => {
      const mockWS = new MockWebSocket();
      mockWS.isAlive = false;

      const mockWSSInstance = {
        on: jest.fn(),
        handleUpgrade: jest.fn(),
        clients: new Set([mockWS]),
      };

      const originalWSS = WebSocket.Server;
      (global as any).WebSocket.Server = jest.fn(() => mockWSSInstance);

      wsManager.init(mockServer as any);

      // Manually trigger heartbeat check
      if (wsManager.heartbeatInterval) {
        clearInterval(wsManager.heartbeatInterval);
      }

      // Simulate heartbeat check
      mockWSSInstance.clients.forEach((ws) => {
        if (!ws.isAlive) {
          ws.terminate();
          wsManager.clients.delete(ws);
        } else {
          ws.isAlive = false;
          ws.ping();
        }
      });

      expect(mockWS.readyState).toBe(WebSocket.CLOSED);
      expect(wsManager.clients.has(mockWS)).toBe(false);
      (global as any).WebSocket.Server = originalWSS;
    });
  });

  describe("Notification System", () => {
    it("should notify all connected clients of new bookings", () => {
      const mockWS1 = new MockWebSocket();
      const mockWS2 = new MockWebSocket();
      const mockWS3 = new MockWebSocket();
      mockWS3.readyState = WebSocket.CLOSED; // Simulate closed connection

      wsManager.clients.add(mockWS1);
      wsManager.clients.add(mockWS2);
      wsManager.clients.add(mockWS3);

      const booking = {
        id: "123",
        customerName: "John Doe",
        eventDate: "2024-12-25",
      };

      wsManager.notifyNewBooking(booking);

      const expectedMessage = JSON.stringify({
        type: "new_booking",
        booking,
      });

      expect(mockWS1.lastSentMessage).toBe(expectedMessage);
      expect(mockWS2.lastSentMessage).toBe(expectedMessage);
      expect(mockWS3.lastSentMessage).toBeUndefined(); // Should not send to closed connection
    });

    it("should return correct client count", () => {
      const mockWS1 = new MockWebSocket();
      const mockWS2 = new MockWebSocket();

      wsManager.clients.add(mockWS1);
      wsManager.clients.add(mockWS2);

      expect(wsManager.getClientCount()).toBe(2);

      wsManager.clients.delete(mockWS1);
      expect(wsManager.getClientCount()).toBe(1);
    });
  });

  describe("Server Upgrade Handling", () => {
    it("should handle WebSocket upgrade requests", () => {
      const mockSocket = {};
      const mockHead = Buffer.alloc(0);
      const mockRequest = {
        headers: { upgrade: "websocket" },
      };

      const mockWSSInstance = {
        on: jest.fn(),
        handleUpgrade: jest.fn((request, socket, head, callback) => {
          const ws = new MockWebSocket();
          callback(ws);
        }),
        clients: new Set(),
      };

      const originalWSS = WebSocket.Server;
      (global as any).WebSocket.Server = jest.fn(() => mockWSSInstance);

      wsManager.init(mockServer as any);

      // Simulate upgrade request
      mockServer.emit("upgrade", mockRequest, mockSocket, mockHead);

      expect(mockWSSInstance.handleUpgrade).toHaveBeenCalledWith(
        mockRequest,
        mockSocket,
        mockHead,
        expect.any(Function)
      );
      (global as any).WebSocket.Server = originalWSS;
    });

    it("should destroy non-WebSocket upgrade requests", () => {
      const mockSocket = {
        destroy: jest.fn(),
      };
      const mockRequest = {
        headers: { upgrade: "http" }, // Not websocket
      };

      const mockWSSInstance = {
        on: jest.fn(),
        handleUpgrade: jest.fn(),
        clients: new Set(),
      };

      const originalWSS = WebSocket.Server;
      (global as any).WebSocket.Server = jest.fn(() => mockWSSInstance);

      wsManager.init(mockServer as any);

      // Simulate non-websocket upgrade request
      mockServer.emit("upgrade", mockRequest, mockSocket, Buffer.alloc(0));

      expect(mockSocket.destroy).toHaveBeenCalled();
      expect(mockWSSInstance.handleUpgrade).not.toHaveBeenCalled();
      (global as any).WebSocket.Server = originalWSS;
    });
  });
});
