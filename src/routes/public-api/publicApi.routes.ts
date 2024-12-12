import { Router } from 'express';

import { login } from '@vote-seat-api/controllers/session.controller';

const apiRouter = Router();

apiRouter.post('/login', login);

export default apiRouter;
