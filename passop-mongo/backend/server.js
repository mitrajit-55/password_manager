const express = require('express');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

// Environment Variables
const url = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const port = process.env.PORT || 3000;

// Initialize App
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const client = new MongoClient(url);

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
    }
}

connectDB();

// =======================
// ROUTES
// =======================

// ✅ GET all passwords
app.get('/', async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const passwords = await collection.find({}).toArray();
        res.json(passwords);
    } catch (error) {
        console.error("Error fetching passwords:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// ✅ POST: Save a new password
app.post('/', async (req, res) => {
    try {
        const newPassword = req.body;
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const result = await collection.insertOne(newPassword);
        res.json({ success: true, result });
    } catch (error) {
        console.error("Error saving password:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// ✅ DELETE: Delete a password by _id
app.delete('/', async (req, res) => {
    try {
        const { _id } = req.body;
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const result = await collection.deleteOne({ _id: new ObjectId(_id) });
        res.json({ success: true, result });
    } catch (error) {
        console.error("Error deleting password:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// ✅ PUT: Update a password by _id
app.put('/', async (req, res) => {
    const { _id, site, username, password } = req.body;

    if (!_id || !site || !username || !password) {
        return res.status(400).json({ success: false, message: "Missing fields" });
    }

    try {
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const result = await collection.updateOne(
            { _id: new ObjectId(_id) },
            { $set: { site, username, password } }
        );

        if (result.modifiedCount === 1) {
            res.json({ success: true, result });
        } else {
            res.json({ success: false, message: "No changes made" });
        }
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
