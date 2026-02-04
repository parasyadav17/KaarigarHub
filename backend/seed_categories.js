const mongoose = require("mongoose");
const Category = require("./models/category");
require("dotenv").config();

const categories = [
    { name: "Electrician", description: "Wiring, installation, and repair of electrical systems" },
    { name: "Plumber", description: "Installation and repair of pipes and fixtures" },
    { name: "Carpenter", description: "Woodworking and furniture repair" },
    { name: "Painter", description: "Interior and exterior painting services" },
    { name: "Mason", description: "Bricklaying, stone work, and concrete" },
    { name: "Welder", description: "Metal fusion and fabrication" },
    { name: "Cleaner", description: "Home and office cleaning services" },
    { name: "Gardener", description: "Lawn care and landscaping" },
];

async function seedCategories() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing categories to avoid duplicates (optional, strictly speaking we could upsert)
        // await Category.deleteMany({}); 
        // console.log("Cleared existing categories.");

        for (const cat of categories) {
            const existing = await Category.findOne({ name: cat.name });
            if (!existing) {
                await Category.create(cat);
                console.log(`Created category: ${cat.name}`);
            } else {
                console.log(`Category already exists: ${cat.name}`);
            }
        }

        console.log("✅ Seeding complete.");
        process.exit(0);

    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

seedCategories();
