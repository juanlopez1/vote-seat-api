import express from 'express';

import applyMiddlewares from '@vote-seat-api/middlewares';
import mySqlDB from '@vote-seat-api/db/mysql';
import routes from '@vote-seat-api/routes';

const app = express();

applyMiddlewares(app);
mySqlDB.configure();

app.use('/', routes);

export default app;
