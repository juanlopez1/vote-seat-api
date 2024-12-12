import { type Request, type Response, Router } from 'express';

import { calculateSeats, getHistory } from '@vote-seat-api/controllers/calculation.controller';
import type { ApiRequest, CalculateRequest } from '@vote-seat-api/types/request.types';

const apiRouter = Router();

/**
 * @swagger
 * api/calculate:
 *   post:
 *     summary: Realiza el cálculo de D'Hondt
 *     security:
 *       - BearerAuth: []
 *     description: Permite realizar el calculo o método D'Hondt para repartir escaños en base a listas y votos. Este endpoint también permite almacenar dicho cálculo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seats:
 *                 type: number
 *                 example: 70
 *               partiesLists:
 *                 type: Array
 *                 example: [{ name: 'Lista 1', votes: 45796 }, { name: 'Lista 2', votes: 6895 }]
 *               save:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       '200':
 *         description: Devuelve la cantidad de escaños en total y los resultados de las listas, sus nombres, votos y escaños adquiridos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: Array
 *                   example: [{ name: 'Lista 1', votes: 4825, seats: 5 }]
 *                 seats:
 *                   type: number
 *                   example: 10
 *       '201':
 *         description: Devuelve la cantidad de escaños en total y los resultados de las listas, sus nombres, votos y escaños adquiridos, y el id con el que se almacenó el cálculo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: Array
 *                   example: [{ name: 'Lista 1', votes: 4825, seats: 5 }]
 *                 seats:
 *                   type: number
 *                   example: 10
 *                 id:
 *                   type: number
 *                   example: 1
 *       '400':
 *         description: Error cuando faltan datos necesarios para realizar el cálculo.
 *       '500':
 *         description: Error interno del servidor
 */
apiRouter.post('/calculate', (req: Request, res: Response) => {
    calculateSeats(req as CalculateRequest, res);
});

/**
 * @swagger
 * api/history:
 *   get:
 *     summary: Devuelve le historial de cálculos realizados y almacenados
 *     security:
 *       - BearerAuth: []
 *     description: Permite al usuario consultar por cálculos ya realizados.
 *     responses:
 *       '200':
 *         description: Envía el historial completo de cálculos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 seats:
 *                   type: number
 *                   example: 14
 *                 listQuantity:
 *                   type: number
 *                   example: 18
 *                 createdAt:
 *                   type: string
 *                   example: Thu Dec 12 2024 02:33:44 GMT-0300
 *                 partiesLists:
 *                   type: array
 *                   example: [{ name: 'Lista 1', votes: 4825, seats: 5 }]
 *       '500':
 *         description: Error interno del servidor
 */
apiRouter.get('/history', (req: Request, res: Response) => {
    getHistory(req as ApiRequest, res);
});

export default apiRouter;
