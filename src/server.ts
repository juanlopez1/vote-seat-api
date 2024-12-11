import dotenv from 'dotenv';

dotenv.config();

import app from '@vote-seat-api/app';
import logger from '@vote-seat-api/helpers/logger';

app.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`);
});
