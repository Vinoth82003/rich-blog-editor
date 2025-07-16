// lib/rateLimiter.js
import { RateLimiterMemory } from "rate-limiter-flexible";

export const rateLimiter = new RateLimiterMemory({
  points: 100, 
  duration: 60, 
  keyPrefix: "public-api", 
});
