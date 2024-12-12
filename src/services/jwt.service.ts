import jwt from 'jsonwebtoken';

import logger from '@vote-seat-api/helpers/logger';

const SECRET_KEY = process.env.JWT_SECRET_KEY as string;

class JwtService {
    generateToken(payload: Record<string, string | number>) {
        return jwt.sign(payload, SECRET_KEY);
    }

    verifyToken(token: string) {
        try {
            return jwt.verify(token, SECRET_KEY);
        } catch (error) {
            logger.info('JWT: Invalid or expired token', error);
            throw new Error('Invalid or expired token');
        }
    }
}

const jwtService = new JwtService();
export default jwtService;
