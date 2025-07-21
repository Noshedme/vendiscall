// db.js
import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "vendiscall",
  password: "intesud", // cambia esto
  port: 5432,
});
