import mysql, { type Connection } from 'mysql2/promise';

import logger from '@vote-seat-api/helpers/logger';

class MySqlDB {
    private connection: Connection | null = null;
    private maxRetries = 5;
    private retryInterval = 5000;

    getConnection() {
        if (!this.connection) {
            throw new Error('MySQL connection is not initialized');
        }
        return this.connection;
    }

    async configure() {
        await this.connectToDatabase();
    }

    private async connectToDatabase() {
        let retries = 0;

        while (retries < this.maxRetries) {
            try {
                this.connection = await mysql.createConnection({
                    host: process.env.MY_SQL_DB_HOST,
                    user: process.env.MY_SQL_DB_USERNAME,
                    password: process.env.MY_SQL_DB_PASSWORD,
                    database: process.env.MY_SQL_DB_NAME,
                    port: Number(process.env.MY_SQL_DB_PORT),
                });
                await this.connection.connect();

                logger.info(`Connected to the MySQL server at ${this.connection?.config.host}`);
                break;
            } catch (error) {
                retries++;
                logger.error(`Connection attempt ${retries} failed: ${error}`);

                if (retries >= this.maxRetries) {
                    logger.error('Max retries reached. Exiting...');
                    process.exit(1);
                }

                logger.info(`Retrying in ${this.retryInterval / 1000} seconds...`);
                await this.delay(this.retryInterval);
            }
        }

        this.connection?.on('end', () => {
            logger.info('MySQL connection closed');
        });

        this.connection?.on('error', (err) => {
            logger.error(`MySQL connection error: ${err.stack}`);
            this.reconnect();
        });
    }

    private delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private async reconnect() {
        logger.info('Attempting to reconnect...');
        await this.connectToDatabase();
    }
}

const mySqlDB = new MySqlDB();
export default mySqlDB;
