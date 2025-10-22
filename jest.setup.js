import "@testing-library/jest-dom";

// Mock MongoDB and Mongoose for unit tests
jest.mock("mongoose", () => ({
  connect: jest.fn().mockResolvedValue({}),
  disconnect: jest.fn().mockResolvedValue({}),
  models: {},
  connection: {
    readyState: 1,
    on: jest.fn(),
    once: jest.fn(),
  },
  Schema: jest.fn().mockImplementation((definition) => ({
    pre: jest.fn(),
    post: jest.fn(),
    methods: {},
    statics: {},
    virtual: jest.fn(),
    index: jest.fn(),
    plugin: jest.fn(),
    Types: {
      ObjectId: jest.fn().mockImplementation((id) => ({
        toString: () => id || "mock-object-id",
      })),
    },
  })),
  model: jest.fn().mockImplementation((name, schema) => {
    const Model = class MockModel {
      constructor(data = {}) {
        Object.assign(this, data);
        this._id = data._id || "mock-id";
        this.save = jest.fn().mockResolvedValue(this);
        this.remove = jest.fn().mockResolvedValue(this);
      }

      static find = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });
      static findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      static findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      static create = jest.fn().mockResolvedValue({});
      static findByIdAndUpdate = jest.fn().mockResolvedValue({});
      static findByIdAndDelete = jest.fn().mockResolvedValue({});
      static countDocuments = jest.fn().mockResolvedValue(0);
      static deleteMany = jest.fn().mockResolvedValue({ deletedCount: 0 });
    };
    return Model;
  }),
  Types: {
    ObjectId: jest
      .fn()
      .mockImplementation((id) => ({ toString: () => id || "mock-object-id" })),
  },
}));

jest.mock("mongodb", () => ({
  MongoClient: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue({}),
    db: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([]),
        }),
        findOne: jest.fn().mockResolvedValue(null),
        insertOne: jest.fn().mockResolvedValue({ insertedId: "mock-id" }),
        updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      }),
    }),
    close: jest.fn(),
  })),
  MongoMemoryServer: jest.fn().mockImplementation(() => ({
    create: jest.fn().mockResolvedValue({
      getUri: jest.fn().mockReturnValue("mongodb://localhost:27017/test"),
      stop: jest.fn().mockResolvedValue(undefined),
    }),
  })),
}));

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      pathname: "/",
      query: {},
      asPath: "/",
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return "/";
  },
}));

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000";
process.env.MONGODB_URI = "mongodb://localhost:27017/test";
process.env.JWT_SECRET = "test-jwt-secret";

// Global test utilities
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock WebSocket
global.WebSocket = jest.fn().mockImplementation(() => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
  send: jest.fn(),
  close: jest.fn(),
  readyState: 1,
}));

// Mock TextEncoder and TextDecoder for Next.js
global.TextEncoder = class TextEncoder {
  encode(str) {
    return Buffer.from(str, "utf-8");
  }
};

global.TextDecoder = class TextDecoder {
  decode(buffer) {
    return buffer.toString("utf-8");
  }
};

// Mock setImmediate for Node.js compatibility
global.setImmediate =
  global.setImmediate || ((fn, ...args) => setTimeout(fn, 0, ...args));

// Mock Request and Response for Next.js API routes
global.Request = class Request {
  constructor(url, options = {}) {
    this.url = url;
    this.method = options.method || "GET";
    this.headers = new Map();
    this.body = options.body;
  }
};

global.Response = class Response {
  constructor(body, options = {}) {
    this.body = body;
    this.status = options.status || 200;
    this.statusText = options.statusText || "";
    this.headers = new Map();
  }

  json() {
    return Promise.resolve(JSON.parse(this.body));
  }

  text() {
    return Promise.resolve(this.body);
  }
};

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});
