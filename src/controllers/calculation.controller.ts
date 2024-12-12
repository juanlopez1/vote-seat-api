import type { Response } from 'express';

import calculationService from '@vote-seat-api/services/calculation.service';
import logger from '@vote-seat-api/helpers/logger';
import type { ApiRequest, CalculateRequest } from '@vote-seat-api/types/request.types';

export const calculateSeats = async (req: CalculateRequest, res: Response) => {
    try {
        const { partiesLists, seats, save } = req.body;

        if (!seats || !partiesLists || !Array.isArray(partiesLists)) {
            return res.status(400).json({ error: 'Faltan datos necesarios para realizar el cálculo' });
        }

        const result = calculationService.calculate(seats, partiesLists);

        if (save) {
            const id = await calculationService.save(seats, result);
            res.status(201).json({ id, result, seats });
            return;
        }
        res.json({ result, seats });
    } catch (error) {
        logger.error('Error while trying to realize dhondt calculation', error);
        res.status(500).json('Error al intentar realizar el cálculo');
    }
};

export const getHistory = async (_: ApiRequest, res: Response) => {
    try {
        const history = await calculationService.fetchAll();
        res.status(200).json(history);
    } catch (error) {
        logger.error('Error while trying to get calculation history', error);
        res.status(500).json({ error: 'Error al intentar obtener el historial' });
    }
};
