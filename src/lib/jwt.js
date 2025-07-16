import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

export const generateToken = (userId, remember = false) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: remember ? "7d" : "1hr",
  });
};

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);
