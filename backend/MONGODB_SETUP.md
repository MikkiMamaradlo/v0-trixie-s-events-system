# MongoDB Setup Guide for TRIXTECH Backend

## Prerequisites
- Node.js installed
- MongoDB installed and running locally OR MongoDB Atlas account

## Option 1: Local MongoDB (Recommended for Development)

### Install MongoDB
- **Windows**: Download from https://www.mongodb.com/try/download/community
- **Mac**: `brew install mongodb-community`
- **Linux**: `sudo apt-get install mongodb`

### Start MongoDB Service
- **Windows**: MongoDB service starts automatically
- **Mac**: `brew services start mongodb-community`
- **Linux**: `sudo systemctl start mongod`

### Install MongoDB Compass (GUI)
- Download from https://www.mongodb.com/products/compass
- Default connection: `mongodb://localhost:27017`
- Database name: `trixtech`

## Option 2: MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/trixtech`
4. Update `backend/.env`: `MONGODB_URI=your-connection-string`

## Setup Backend

\`\`\`bash
cd backend
npm install
npm start
\`\`\`

## Verify Connection

Visit: `http://localhost:5000/health`

You should see:
\`\`\`json
{
  "status": "Backend is running",
  "database": "MongoDB connected",
  "timestamp": "..."
}
\`\`\`

## View Data with MongoDB Compass

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select `trixtech` database
4. Browse collections: Users, Services, Bookings, Inventory, Payments

## Sample Data (Optional)

Run this in MongoDB Compass or terminal:

\`\`\`javascript
// Create default admin user
db.users.insertOne({
  email: "admin@trixtech.com",
  password: "admin123",
  role: "admin"
})

// Create sample services
db.services.insertMany([
  {
    name: "Birthday Party Planning",
    category: "party-planning",
    description: "Complete birthday party coordination",
    price: 500
  },
  {
    name: "Wedding Planning",
    category: "party-planning",
    description: "Full wedding coordination",
    price: 2000
  },
  {
    name: "Table & Chair Rental",
    category: "equipment-rental",
    description: "Premium tables and chairs",
    price: 100
  }
])

// Create sample inventory
db.inventories.insertMany([
  { name: "Tables", quantity: 50, price: 25 },
  { name: "Chairs", quantity: 200, price: 5 },
  { name: "Tents", quantity: 10, price: 150 }
])
\`\`\`

## Troubleshooting

**Error: "MongoDB connection refused"**
- Ensure MongoDB service is running
- Check connection string in `.env`
- Verify port 27017 is available

**Error: "ECONNREFUSED"**
- Start MongoDB: `mongod` or use system service
- For Atlas, check IP whitelist in cluster settings

**Data not showing in Compass**
- Refresh connection
- Verify database name matches `.env`
