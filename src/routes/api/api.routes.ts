import { type Request, type Response, Router } from 'express';

import { calculateSeats, getHistory } from '@vote-seat-api/controllers/calculation.controller';
import type { ApiRequest, CalculateRequest } from '@vote-seat-api/types/request.types';

const apiRouter = Router();

apiRouter.post('/calculate', (req: Request, res: Response) => {
    calculateSeats(req as CalculateRequest, res);
});
apiRouter.get('/history', (req: Request, res: Response) => {
    getHistory(req as ApiRequest, res);
});

export default apiRouter;
