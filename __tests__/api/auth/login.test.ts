import { NextRequest } from "next/server";
import { POST } from "../../../app/api/auth/login/route";
import User from "../../../models/User";
import { MongoMemoryServer } from "mongodb";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer;

describe("/api/auth/login", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Set JWT secret for tests
    process.env.JWT_SECRET = "test-jwt-secret-key-for-testing-purposes";
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully with valid credentials", async () => {
      // Create a test user
      const testUser = new User({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "customer",
      });
      await testUser.save();

      const requestBody = {
        email: "test@example.com",
        password: "password123",
      };

      const request = new NextRequest("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "content-type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Login successful");
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe("test@example.com");
      expect(data.user.name).toBe("Test User");
      expect(data.user.role).toBe("customer");
      expect(data.token).toBeDefined();

      // Verify JWT token contains correct data
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
      expect(decoded.userId).toBe(testUser._id.toString());
      expect(decoded.email).toBe("test@example.com");
      expect(decoded.role).toBe("customer");
    });

    it("should return 400 for missing email or password", async () => {
      const testCases = [
        { email: "test@example.com" }, // Missing password
        { password: "password123" }, // Missing email
        {}, // Missing both
      ];

      for (const body of testCases) {
        const request = new NextRequest(
          "http://localhost:3000/api/auth/login",
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "content-type": "application/json",
            },
          }
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.message).toBe("Email and password are required");
      }
    });

    it("should return 401 for non-existent user", async () => {
      const requestBody = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      const request = new NextRequest("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "content-type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.message).toBe("Invalid credentials");
    });

    it("should return 401 for incorrect password", async () => {
      // Create a test user
      const testUser = new User({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
      await testUser.save();

      const requestBody = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const request = new NextRequest("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "content-type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.message).toBe("Invalid credentials");
    });

    it("should handle admin user login", async () => {
      // Create an admin user
      const adminUser = new User({
        name: "Admin User",
        email: "admin@example.com",
        password: "adminpass123",
        role: "admin",
      });
      await adminUser.save();

      const requestBody = {
        email: "admin@example.com",
        password: "adminpass123",
      };

      const request = new NextRequest("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "content-type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.user.role).toBe("admin");

      // Verify JWT contains admin role
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
      expect(decoded.role).toBe("admin");
    });

    it("should include phone number in response when available", async () => {
      const testUser = new User({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        phone: "+1234567890",
      });
      await testUser.save();

      const requestBody = {
        email: "test@example.com",
        password: "password123",
      };

      const request = new NextRequest("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "content-type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user.phone).toBe("+1234567890");
    });

    it("should handle malformed JSON", async () => {
      const request = new NextRequest("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: "invalid json",
        headers: {
          "content-type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.message).toBe("Internal server error");
    });

    it("should handle database connection errors", async () => {
      // Disconnect from database to simulate connection error
      await mongoose.disconnect();

      const requestBody = {
        email: "test@example.com",
        password: "password123",
      };

      const request = new NextRequest("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "content-type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.message).toBe("Internal server error");

      // Reconnect for other tests
      await mongoose.connect(mongoServer.getUri());
    });

    it("should handle case-insensitive email matching", async () => {
      const testUser = new User({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
      await testUser.save();

      const requestBody = {
        email: "TEST@EXAMPLE.COM", // Uppercase
        password: "password123",
      };

      const request = new NextRequest("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "content-type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.user.email).toBe("test@example.com"); // Should be lowercase in response
    });

    it("should not include password in user response", async () => {
      const testUser = new User({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
      await testUser.save();

      const requestBody = {
        email: "test@example.com",
        password: "password123",
      };

      const request = new NextRequest("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "content-type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.user.password).toBeUndefined();
    });

    it("should handle JWT token generation errors", async () => {
      // Create a test user
      const testUser = new User({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
      await testUser.save();

      // Temporarily remove JWT secret
      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      const requestBody = {
        email: "test@example.com",
        password: "password123",
      };

      const request = new NextRequest("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "content-type": "application/json",
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.message).toBe("Internal server error");

      // Restore JWT secret
      process.env.JWT_SECRET = originalSecret;
    });
  });
});
