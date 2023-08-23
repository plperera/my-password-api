import { config } from 'dotenv';
import * as crypto from 'crypto';
import { loadEnv } from '@/config';

loadEnv()
config();

const SECRET_KEY: Buffer = crypto.createHash('sha256').update(process.env.ULTRA_SECRET_KEY!).digest();
const algorithm: string = 'aes-256-cbc';

export function encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, SECRET_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(text: string): string {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift()!, 'hex');
    const encryptedText = parts.join(':');
    const decipher = crypto.createDecipheriv(algorithm, SECRET_KEY, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
