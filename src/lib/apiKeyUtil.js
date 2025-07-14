// lib/apiKeyUtil.js
import crypto from "crypto";
const secret = process.env.API_SECRET || "your-32byte-secret-key";

export function generateApiKey() {
  return crypto.randomBytes(24).toString("hex"); // raw key
}

export function encryptApiKey(apiKey) {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(secret),
    Buffer.alloc(16, 0)
  );
  let encrypted = cipher.update(apiKey, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

export function decryptApiKey(encryptedKey) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secret),
    Buffer.alloc(16, 0)
  );
  let decrypted = decipher.update(encryptedKey, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
