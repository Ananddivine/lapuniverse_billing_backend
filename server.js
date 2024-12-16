const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const fs = require("fs");
const path = require("path");
const invoiceRoutes = require("./routes/invoiceRoutes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Create directory for invoices if it doesn't exist
const invoiceDir = path.join(__dirname, "uploads", "invoices");

if (!fs.existsSync(invoiceDir)) {
  fs.mkdirSync(invoiceDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/invoices", invoiceRoutes);

// Routes
app.use("/api/invoices", require("./routes/invoiceRoutes"));

// Start the server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
