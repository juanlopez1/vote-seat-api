import { type Response, Router } from 'express';

import { calculateSeats, getHistory } from '@vote-seat-api/controllers/dhondt.controller';
import type { CalculateRequest } from '@vote-seat-api/types/dhondt.types';

const dhondtRoutes = Router();

dhondtRoutes.post('/calculate', (req: CalculateRequest, res: Response) => {
    calculateSeats(req, res);
});
dhondtRoutes.get('/history', getHistory);

export default dhondtRoutes;
