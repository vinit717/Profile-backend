import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const signToken = (payload: any, expiresIn: string = '1h') => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
};

export const encryptToken = (token: string, encryptionKey: string): string => {
  const iv = crypto.randomBytes(16);
  const key = Buffer.from(encryptionKey, 'hex');
  
  if (key.length !== 32) {
    throw new Error('Invalid encryption key length. Key must be 32 bytes.');
  }

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
};

export const decryptToken = (encryptedToken: string, encryptionKey: string): string => {
  const textParts = encryptedToken.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};