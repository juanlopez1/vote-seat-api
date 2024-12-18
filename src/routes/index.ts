import { type NextFunction, type Request, type Response, Router } from 'express';

import apiRoutes from '@vote-seat-api/routes/api/api.routes';
import publicApiRoutes from '@vote-seat-api/routes/public-api/publicApi.routes';
import { getInfo } from '@vote-seat-api/controllers/info.controller';
import { authenticate } from '@vote-seat-api/middlewares/authenticate';
import type { ApiRequest } from '@vote-seat-api/types/request.types';

const router = Router();

/**
 * @swagger
 * /info:
 *   get:
 *     summary: Obtiene información de la API
 *     description: Permite visualizar rápidamente información de la API, el author, la version y el repo.
 *     responses:
 *       '200':
 *         description: Envío de información
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   example: "vote-seat-api"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 github:
 *                   type: string
 *                   example: "https://github.com/juanlopez1/vote-seat-api"
 *                 author:
 *                   type: string
 *                   example: "Juan Manuel López"
 *       '500':
 *         description: Error interno del servidor
 */
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
