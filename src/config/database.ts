import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

const { Pool } = pg;

const devConfig = { connectionString: process.env.DATABASE_URL };
const prodConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
};

export const connection = new Pool(
  process.env.MODE === "PROD" ? prodConfig : devConfig
);
