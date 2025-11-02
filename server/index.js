import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/dbconnect.js';
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let swaggerDocument;
try {
  const swaggerData = readFileSync(
    join(__dirname, "swagger.json"),
    "utf8"
  );
  swaggerDocument = JSON.parse(swaggerData);
} catch (error) {
  console.error("❌ Error loading swagger document:", error);
  swaggerDocument = null;
}



// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

if (swaggerDocument) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log("📚 Swagger UI available at: http://localhost:5000/api-docs");
} else {
  app.get("/api-docs", (req, res) => {
    res.status(500).json({ error: "Swagger documentation not available" });
  });
}
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import bookRoutes from './routes/bookRoutes.js';
import userRoutes from './routes/userRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Borrowing Insights API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});