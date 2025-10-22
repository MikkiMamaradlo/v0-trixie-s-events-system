import User, { IUser } from "../../models/User";
import Booking from "../../models/Booking";
import Service from "../../models/Service";
import Payment from "../../models/Payment";

describe("Data Models", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("User Model", () => {
    it("should create a user with valid data", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "customer" as const,
        phone: "+1234567890",
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.name).toBe(userData.name);
      expect(savedUser.email).toBe(userData.email.toLowerCase());
      expect(savedUser.role).toBe(userData.role);
      expect(savedUser.phone).toBe(userData.phone);
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
    });

    it("should hash password before saving", async () => {
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      await user.save();

      // Password should be hashed
      expect(user.password).not.toBe("password123");
      expect(user.password.length).toBeGreaterThan(10); // bcrypt hash is longer
    });

    it("should compare password correctly", async () => {
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      await user.save();

      const isValidPassword = await user.comparePassword("password123");
      const isInvalidPassword = await user.comparePassword("wrongpassword");

      expect(isValidPassword).toBe(true);
      expect(isInvalidPassword).toBe(false);
    });

    it("should validate required fields", async () => {
      const user = new User({});

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.name).toBeDefined();
      expect(error.errors.email).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });

    it("should validate email format", async () => {
      const user = new User({
        name: "Test User",
        email: "invalid-email",
        password: "password123",
      });

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.email).toBeDefined();
    });

    it("should enforce unique email", async () => {
      await new User({
        name: "User 1",
        email: "duplicate@example.com",
        password: "password123",
      }).save();

      const user2 = new User({
        name: "User 2",
        email: "duplicate@example.com",
        password: "password456",
      });

      let error;
      try {
        await user2.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000); // MongoDB duplicate key error
    });

    it("should validate password minimum length", async () => {
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: "12345", // Too short
      });

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });

    it("should validate name maximum length", async () => {
      const longName = "a".repeat(51); // Exceeds 50 characters
      const user = new User({
        name: longName,
        email: "test@example.com",
        password: "password123",
      });

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.name).toBeDefined();
    });

    it("should set default role to customer", async () => {
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        // No role specified
      });

      await user.save();
      expect(user.role).toBe("customer");
    });

    it("should validate role enum values", async () => {
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "invalid" as any,
      });

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.role).toBeDefined();
    });

    it("should exclude password from JSON output", async () => {
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      await user.save();

      const userJson = user.toJSON();
      expect(userJson.password).toBeUndefined();
    });

    it("should trim whitespace from name and email", async () => {
      const user = new User({
        name: "  Test User  ",
        email: "  test@example.com  ",
        password: "password123",
      });

      await user.save();

      expect(user.name).toBe("Test User");
      expect(user.email).toBe("test@example.com");
    });
  });

  describe("Service Model", () => {
    it("should create a service with valid data", async () => {
      const serviceData = {
        name: "Wedding Photography",
        description: "Professional wedding photography service",
        price: 1500,
        category: "Photography",
        duration: 6,
        maxGuests: 200,
      };

      const service = new Service(serviceData);
      const savedService = await service.save();

      expect(savedService.name).toBe(serviceData.name);
      expect(savedService.description).toBe(serviceData.description);
      expect(savedService.price).toBe(serviceData.price);
      expect(savedService.category).toBe(serviceData.category);
      expect(savedService.duration).toBe(serviceData.duration);
      expect(savedService.maxGuests).toBe(serviceData.maxGuests);
    });

    it("should validate required fields", async () => {
      const service = new Service({});

      let error;
      try {
        await service.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.name).toBeDefined();
      expect(error.errors.price).toBeDefined();
    });
  });

  describe("Booking Model", () => {
    it("should create a booking with valid data", async () => {
      // First create a user and service
      const user = await new User({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }).save();

      const service = await new Service({
        name: "Wedding Photography",
        description: "Professional wedding photography",
        price: 1500,
        category: "Photography",
      }).save();

      const bookingData = {
        customerId: user._id,
        serviceId: service._id,
        eventDate: new Date("2024-12-25"),
        status: "confirmed" as const,
        totalAmount: 1500,
        guestCount: 150,
        specialRequests: "Outdoor ceremony preferred",
      };

      const booking = new Booking(bookingData);
      const savedBooking = await booking.save();

      expect(savedBooking.customerId.toString()).toBe(user._id.toString());
      expect(savedBooking.serviceId.toString()).toBe(service._id.toString());
      expect(savedBooking.eventDate.toISOString().split("T")[0]).toBe(
        "2024-12-25"
      );
      expect(savedBooking.status).toBe("confirmed");
      expect(savedBooking.totalAmount).toBe(1500);
      expect(savedBooking.guestCount).toBe(150);
      expect(savedBooking.specialRequests).toBe("Outdoor ceremony preferred");
    });
  });

  describe("Payment Model", () => {
    it("should create a payment with valid data", async () => {
      // Create user and booking first
      const user = await new User({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }).save();

      const booking = await new Booking({
        customerId: user._id,
        serviceId: "507f1f77bcf86cd799439011", // Mock ObjectId string
        eventDate: new Date(),
        totalAmount: 1500,
      }).save();

      const paymentData = {
        bookingId: booking._id,
        customerId: user._id,
        amount: 1500,
        currency: "USD",
        status: "completed" as const,
        paymentMethod: "card",
        transactionId: "txn_123456789",
      };

      const payment = new Payment(paymentData);
      const savedPayment = await payment.save();

      expect(savedPayment.bookingId.toString()).toBe(booking._id.toString());
      expect(savedPayment.customerId.toString()).toBe(user._id.toString());
      expect(savedPayment.amount).toBe(1500);
      expect(savedPayment.currency).toBe("USD");
      expect(savedPayment.status).toBe("completed");
      expect(savedPayment.paymentMethod).toBe("card");
      expect(savedPayment.transactionId).toBe("txn_123456789");
    });
  });
});
