import type { Response, NextFunction } from 'express';

import jwtService from '@vote-seat-api/services/jwt.service';
import type { ApiRequest } from '@vote-seat-api/types/request.types';

export const authenticate = (req: ApiRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Acceso denegado' });
            return;
        }

        const decoded = jwtService.verifyToken(token);
        req.user = decoded as { id: number; username: string };
        next();
    } catch (_) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
