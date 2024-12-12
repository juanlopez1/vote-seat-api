import express from 'express';

import applyMiddlewares from '@vote-seat-api/middlewares';
import mySqlDB from '@vote-seat-api/db/mysql';
import routes from '@vote-seat-api/routes';
import { swaggerSpec, swaggerUi } from '@vote-seat-api/../swagger';

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

applyMiddlewares(app);
mySqlDB.configure();

app.use('/', routes);

export default app;
