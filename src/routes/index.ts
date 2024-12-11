import { Router } from 'express';

import { getInfo } from '@vote-seat-api/controllers/info.controller';
import apiRoutes from '@vote-seat-api/routes/api/api.routes';

const router = Router();

router.get('/', getInfo);
router.use('/api', apiRoutes);

export default router;
