import type { Response } from 'express';
import bcrypt from 'bcrypt';

import jwtService from '@vote-seat-api/services/jwt.service';
import userService from '@vote-seat-api/services/user.service';
import logger from '@vote-seat-api/helpers/logger';
import type { LoginRequest } from '@vote-seat-api/types/request.types';

export const login = async (req: LoginRequest, res: Response) => {
    try {
        const { username, password } = req.body;

        const user = await userService.getUserByUsername(username);
        if (!user) {
            res.status(404).json({ message: 'User no encontrado' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Credenciales invalidas' });
            return;
        }

        const token = jwtService.generateToken({ id: user.id, username: user.username });
        await userService.updateUserToken(user.id, token);
        res.json({ username: user.username, token });
    } catch (error) {
        logger.error('Error while trying to login', error);
        res.status(500).json({ message: 'Server error' });
    }
};
