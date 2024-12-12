import { Router } from 'express';

import { login } from '@vote-seat-api/controllers/session.controller';

const apiRouter = Router();

/**
 * @swagger
 * public-api/login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     description: Permite a un usuario iniciar sesión con su usuario y contraseña.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: msaTest
 *               password:
 *                 type: string
 *                 example: ARG_2024
 *     responses:
 *       '200':
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: "msaTest"
 *                 token:
 *                   type: string
 *                   example: "abcdef1234567890"
 *       '404':
 *         description: Error cuando el usuario no existe
 *       '401':
 *         description: Error cuando las credenciales son invalidas
 *       '500':
 *         description: Error interno del servidor
 */
apiRouter.post('/login', login);

export default apiRouter;
