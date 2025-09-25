import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cryptoRoutes from "./routes/cryptoRoutes.js";

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(express.json());

// routes untuk API
app.use("/api/crypto", cryptoRoutes);

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

export default app;