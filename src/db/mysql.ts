import mysql, { type Connection } from 'mysql2/promise';

import logger from '@vote-seat-api/helpers/logger';

class MySqlDB {
    private connection: Connection | null = null;

    async configure() {
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
        } catch (error) {
            logger.error(`Connection error: ${error}`);
            process.exit(1);
        }

        this.connection.on('end', () => {
            logger.info('MySQL connection closed');
        });
        this.connection.on('error', (err) => {
            logger.error(`MySQL connection error: ${err.stack}`);
            process.exit(1);
        });
    }

    getConnection() {
        if (!this.connection) {
            throw new Error('MySQL connection is not initialized');
        }
        return this.connection;
    }
}

const mySqlDB = new MySqlDB();
export default mySqlDB;
