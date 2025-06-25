import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import User from '../models/User.js';

dotenv.config({ path: '../../.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI not found in .env file");
}

async function dbConnect() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
    process.exit(1);
  }
}

async function seed() {
  await dbConnect();

  await User.deleteMany({});
  await Order.deleteMany({});

  const user = await User.create({
    name: "Harsh Dodiya",
    email: "harsh@example.com",
    password: "123456",
    travellers: [
      { name: "Riya Sharma", age: 28, passport: "P12345678" },
      { name: "Aman Verma", age: 31, passport: "P23456789" },
    ],
  });

  await Order.create([
    {
      userId: user._id,
      status: "upcoming",
      origin: "Delhi",
      destination: "Dubai",
      last_travel_date: new Date("2025-08-15"),
      flights: true,
      hotel: true,
    },
    {
      userId: user._id,
      status: "completed",
      origin: "Mumbai",
      destination: "Singapore",
      last_travel_date: new Date("2024-12-10"),
      flights: false,
      hotel: true,
    },
  ]);

  console.log("✅ Seed complete");
  process.exit();
}

seed().catch((err) => {
  console.error("❌ Seed failed", err);
  process.exit(1);
});
