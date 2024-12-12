import { type NextFunction, type Request, type Response, Router } from 'express';

import apiRoutes from '@vote-seat-api/routes/api/api.routes';
import publicApiRoutes from '@vote-seat-api/routes/public-api/publicApi.routes';
import { getInfo } from '@vote-seat-api/controllers/info.controller';
import { authenticate } from '@vote-seat-api/middlewares/authenticate';
import type { ApiRequest } from '@vote-seat-api/types/request.types';

const router = Router();

router.get('/info', getInfo);
router.use('/public-api', publicApiRoutes);
router.use(
    '/api',
    (req: Request, res: Response, next: NextFunction) => {
        authenticate(req as ApiRequest, res, next);
    },
    apiRoutes,
);

export default router;
