import { type Response, Router } from 'express';

import { calculateSeats, getHistory } from '@vote-seat-api/controllers/calculation.controller';
import type { CalculateRequest } from '@vote-seat-api/types/calculation.types';

const apiRouter = Router();

apiRouter.post('/calculate', (req: CalculateRequest, res: Response) => {
    calculateSeats(req, res);
});
apiRouter.get('/history', getHistory);

export default apiRouter;
