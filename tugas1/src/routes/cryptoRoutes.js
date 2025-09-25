import express from "express";
import { shiftEncrypt, shiftDecrypt } from "../ciphers/index.js";

const router = express.Router();

router.post("/shift/encrypt", (req, res) => {
  const { text, shift } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  const encrypted = shiftEncrypt(text, parseInt(shift) || 3);
  res.json({ encrypted });
});

router.post("/shift/decrypt", (req, res) => {
  const { text, shift } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  const decrypted = shiftDecrypt(text, parseInt(shift) || 3);
  res.json({ decrypted });
});

export default router;