import type { Request, Response } from 'express';

import logger from '@vote-seat-api/helpers/logger';
import pkg from '@vote-seat-api/../package.json';

export const getInfo = async (_: Request, res: Response) => {
    try {
        res.status(200).json({
            title: pkg.name,
            version: pkg.version,
            github: pkg.repository.url,
            author: pkg.author.name,
        });
    } catch (error) {
        logger.error('Error package', error);
        res.status(500).json({ error: 'error package', message: 'Error en el package' });
    }
};
