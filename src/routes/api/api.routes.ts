import { Router } from 'express';

import dhondtRoutes from '@vote-seat-api/routes/api/dhondt/dhondt.routes';

const apiRouter = Router();

apiRouter.use('/dhondt', dhondtRoutes);

export default apiRouter;
