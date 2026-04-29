import { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';

export const ipWhitelist = (req: Request, res: Response, next: NextFunction) => {
  const allowedIpsString = process.env.ALLOWED_IPS || '';
  if (!allowedIpsString) {
    return next();
  }

  const allowedIps = allowedIpsString.split(',').map(ip => ip.trim());
  const clientIp = req.ip || req.socket.remoteAddress || '';

  // Handle IPv6 mapped IPv4 addresses
  const normalizedClientIp = clientIp.replace('::ffff:', '');

  if (!allowedIps.includes(normalizedClientIp)) {
    logger.warn(`Blocked request from unauthorized IP: ${clientIp}`);
    return res.status(403).json({
      status: 'error',
      message: 'Forbidden: IP not whitelisted',
      metadata: { clientIp: normalizedClientIp }
    });
  }

  next();
};
