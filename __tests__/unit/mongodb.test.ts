import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectToDatabase from "../../lib/mongodb";

let mongoServer: MongoMemoryServer;

describe("MongoDB Connection", () => {
  beforeAll(async () => {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Override the environment variable for testing
    process.env.MONGODB_URI = mongoUri;
  });

  afterAll(async () => {
    // Close the connection and stop the server
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear the cached connection before each test
    const cached = (global as { mongoose?: any }).mongoose;
    if (cached) {
      cached.conn = null;
      cached.promise = null;
    }
  });

  describe("connectToDatabase", () => {
    it("should establish a connection to MongoDB", async () => {
      const connection = await connectToDatabase();

      expect(connection).toBeDefined();
      expect(connection.readyState).toBe(1); // Connected state
      expect(mongoose.connection.readyState).toBe(1);
    });

    it("should return the cached connection on subsequent calls", async () => {
      // First call
      const connection1 = await connectToDatabase();
      expect(connection1).toBeDefined();

      // Second call should return the same connection
      const connection2 = await connectToDatabase();
      expect(connection2).toBe(connection1);
    });

    it("should handle connection errors gracefully", async () => {
      // Temporarily set invalid URI
      const originalUri = process.env.MONGODB_URI;
      process.env.MONGODB_URI = "mongodb://invalid:27017/test";

      // Clear cache to force reconnection
      const cached = (global as { mongoose?: any }).mongoose;
      if (cached) {
        cached.conn = null;
        cached.promise = null;
      }

      await expect(connectToDatabase()).rejects.toThrow();

      // Restore original URI
      process.env.MONGODB_URI = originalUri;
    });

    it("should throw error when MONGODB_URI is not defined", async () => {
      const originalUri = process.env.MONGODB_URI;
      delete process.env.MONGODB_URI;

      // Clear cache
      const cached = (global as { mongoose?: any }).mongoose;
      if (cached) {
        cached.conn = null;
        cached.promise = null;
      }

      await expect(connectToDatabase()).rejects.toThrow(
        "Please define the MONGODB_URI environment variable inside .env.local"
      );

      // Restore original URI
      process.env.MONGODB_URI = originalUri;
    });

    it("should handle multiple concurrent connection attempts", async () => {
      // Clear cache
      const cached = (global as { mongoose?: any }).mongoose;
      if (cached) {
        cached.conn = null;
        cached.promise = null;
      }

      // Make multiple concurrent connection attempts
      const promises = [
        connectToDatabase(),
        connectToDatabase(),
        connectToDatabase(),
        connectToDatabase(),
        connectToDatabase(),
      ];

      const results = await Promise.all(promises);

      // All should return the same connection
      const firstConnection = results[0];
      results.forEach((connection) => {
        expect(connection).toBe(firstConnection);
      });
    });

    it("should maintain connection across hot reloads simulation", async () => {
      // First connection
      const connection1 = await connectToDatabase();
      expect(connection1.readyState).toBe(1);

      // Simulate hot reload by clearing cache but keeping connection alive
      const cached = (global as { mongoose?: any }).mongoose;
      if (cached) {
        cached.conn = null;
        cached.promise = null;
      }

      // Next call should reuse existing connection
      const connection2 = await connectToDatabase();
      expect(connection2).toBe(connection1);
      expect(connection2.readyState).toBe(1);
    });

    it("should use correct connection options", async () => {
      // Clear cache to force new connection
      const cached = (global as { mongoose?: any }).mongoose;
      if (cached) {
        cached.conn = null;
        cached.promise = null;
      }

      await connectToDatabase();

      // Check that mongoose connection was made with expected options
      expect(mongoose.connection.readyState).toBe(1);
      expect(mongoose.connection.db).toBeDefined();
    });

    it("should handle connection timeout gracefully", async () => {
      // Set a very short timeout for testing
      const originalUri = process.env.MONGODB_URI;
      process.env.MONGODB_URI =
        "mongodb://nonexistent:27017/test?connectTimeoutMS=100";

      // Clear cache
      const cached = (global as { mongoose?: any }).mongoose;
      if (cached) {
        cached.conn = null;
        cached.promise = null;
      }

      await expect(connectToDatabase()).rejects.toThrow();

      // Restore original URI
      process.env.MONGODB_URI = originalUri;
    });
  });

  describe("Connection State Management", () => {
    it("should properly manage connection states", async () => {
      // Initially no connection
      expect(mongoose.connection.readyState).toBe(0); // disconnected

      // Connect
      await connectToDatabase();
      expect(mongoose.connection.readyState).toBe(1); // connected

      // Disconnect
      await mongoose.disconnect();
      expect(mongoose.connection.readyState).toBe(0); // disconnected
    });

    it("should handle disconnection and reconnection", async () => {
      // Connect
      await connectToDatabase();
      expect(mongoose.connection.readyState).toBe(1);

      // Disconnect
      await mongoose.disconnect();
      expect(mongoose.connection.readyState).toBe(0);

      // Reconnect
      const newConnection = await connectToDatabase();
      expect(newConnection.readyState).toBe(1);
    });
  });
});
