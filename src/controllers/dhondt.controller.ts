import type { Request, Response } from 'express';

import dhondtService from '@vote-seat-api/services/dhondt.service';
import logger from '@vote-seat-api/helpers/logger';
import type { CalculateRequest } from '@vote-seat-api/types/dhondt.types';

export const calculateSeats = async (req: CalculateRequest, res: Response) => {
    try {
        const { lists, seats, save } = req.body;

        if (!seats || !lists || !Array.isArray(lists)) {
            return res.status(400).json({ error: 'Faltan datos necesarios para realizar el cálculo' });
        }

        const result = dhondtService.calculate(seats, lists);

        if (save) {
            const id = await dhondtService.save(seats, result);
            res.status(201).json({ id, result, seats });
            return;
        }
        res.json({ result, seats });
    } catch (error) {
        logger.error('Error while trying to realize dhondt calculation', error);
        res.status(500).json('Error al intentar realizar el cálculo');
    }
};

export const getHistory = async (_: Request, res: Response) => {
    try {
        const history = await dhondtService.fetchAll();
        res.status(200).json(history);
    } catch (error) {
        logger.error('Error while trying to get dhondt calculation history', error);
        res.status(500).json({ error: 'Error al intentar obtener el historial' });
    }
};
