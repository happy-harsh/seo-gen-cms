import mongoose from "mongoose";
import dotenv from "dotenv";
import Page from "../app/models/Page.js";
import User from "../app/models/User.js";


dotenv.config({ path: "../.env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

const DB_NAME = process.env.DB_NAME;

const samplePages = [
    {
        title: "Best Places in Jaipur",
        content: "Jaipur, the Pink City, offers a blend of history and culture. Visit the Amer Fort for stunning architecture, explore the royal City Palace, and don’t miss the Hawa Mahal for its iconic façade. Enjoy shopping in Johari Bazaar and try local dishes like Dal Baati Churma.",
        category: "Travel"
    },
    {
        title: "Top Cafes in Bangalore",
        content: "From the lush greenery of Cubbon Park to the vibrant lanes of Indiranagar, Bangalore is home to charming cafes. Try Third Wave Coffee Roasters, Matteo, and Rasta Café. These spots offer great ambiance and specialty coffee perfect for work or hangouts.",
        category: "Food"
    },
    {
        title: "The Ultimate Guide to Goa Beaches",
        content: "Goa’s coastline stretches across 100 km with popular beaches like Baga, Anjuna, and Palolem. Whether you're looking for nightlife, adventure sports, or quiet sunset views, Goa has it all. Don’t forget to try local seafood and attend a beach party.",
        category: "Travel"
    },
    {
        title: "Easy Vegan Dinner Recipes",
        content: "Looking for easy vegan meals? Try lentil curry, tofu stir-fry with veggies, or quinoa salad with lemon dressing. These recipes are quick, healthy, and packed with flavor — perfect for weeknight dinners.",
        category: "Food"
    },
    {
        title: "How to Start Investing in India",
        content: "If you're new to investing in India, start with mutual funds through SIPs. Learn about the stock market basics, risk tolerance, and long-term goals. Don’t forget to open a Demat account and explore platforms like Zerodha or Groww.",
        category: "Finance"
    }
];

async function seedDB() {
    try {
        await mongoose.connect(MONGODB_URI, {
            dbName:DB_NAME,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("✅ MongoDB connected");

        await User.deleteMany({});
        await Page.deleteMany();
        console.log(" Existing pages cleared");

        const user = await User.create({
            name: "Harsh Dodiya",
            email: "harsh@example.com",
            password: "123456",
            travellers: [
              { name: "Riya Sharma", age: 28, passport: "P12345678" },
              { name: "Aman Verma", age: 31, passport: "P23456789" },
            ],
          });
        

        const result = await Page.insertMany(samplePages);
        console.log(`Inserted ${result.length} sample pages`);
    } catch (error) {
        console.error(" Error seeding database:", error);
    } finally {
        await mongoose.disconnect();
        console.log("MongoDB disconnected");
    }
}

seedDB();
