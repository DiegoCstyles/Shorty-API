import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { nanoid } from "nanoid";
import pkg from "pg";

const { Pool } = pkg;

dotenv.config();
const app = express();
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY || "change-this-secret";

// Postgres pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create table if not exists
await pool.query(`
CREATE TABLE IF NOT EXISTS urls (
  code VARCHAR(10) PRIMARY KEY,
  long_url TEXT NOT NULL,
  hits INT DEFAULT 0
);
`);

// Middleware
function checkApiKey(req, res, next) {
  const key = req.header("x-api-key");
  if (key !== API_KEY) return res.status(403).json({ error: "Invalid API key" });
  next();
}

// Routes
app.post("/shorten", checkApiKey, async (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) return res.status(400).json({ error: "longUrl is required" });
  const code = nanoid(6);
  await pool.query("INSERT INTO urls (code, long_url) VALUES ($1, $2)", [code, longUrl]);
  res.json({ shortUrl: `${process.env.BASE_URL}/${code}`, code, longUrl });
});

app.get("/:code", async (req, res) => {
  const { code } = req.params;
  const result = await pool.query("SELECT long_url, hits FROM urls WHERE code=$1", [code]);
  if (result.rows.length === 0) return res.status(404).json({ error: "Short link not found" });
  await pool.query("UPDATE urls SET hits = hits + 1 WHERE code=$1", [code]);
  res.redirect(result.rows[0].long_url);
});

app.get("/analytics/:code", checkApiKey, async (req, res) => {
  const { code } = req.params;
  const result = await pool.query("SELECT long_url, hits FROM urls WHERE code=$1", [code]);
  if (result.rows.length === 0) return res.status(404).json({ error: "Short link not found" });
  res.json({ code, longUrl: result.rows[0].long_url, hits: result.rows[0].hits });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Shorty API running on port ${PORT}`));
