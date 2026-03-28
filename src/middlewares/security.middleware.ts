import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

/**
 * Security headers middleware.
 * Applies common HTTP hardening headers.
 */
export const securityHeaders = helmet({
  // API project only: CSP can be handled at reverse proxy level if needed.
  contentSecurityPolicy: false,
});

/**
 * Basic API abuse protection.
 * Limits the number of requests per IP on /api routes.
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.NODE_ENV === 'test' ? 1000 : 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again later.',
  },
});
