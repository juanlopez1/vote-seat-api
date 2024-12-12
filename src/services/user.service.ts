import mySqlDB from '@vote-seat-api/db/mysql';
import logger from '@vote-seat-api/helpers/logger';
import type { User } from '@vote-seat-api/types/session.types';

class UserService {
    async getUserByUsername(username: string) {
        try {
            const connection = mySqlDB.getConnection();

            const [users] = await connection.query<User[]>(
                'SELECT `id`, `username`, `password`, `token` FROM `users` WHERE `username` = ? LIMIT 1',
                [username],
            );

            if (users[0]) {
                return users[0];
            }
            return null;
        } catch (error) {
            logger.error('Error while trying to get user', error);
            throw new Error(`Error en la transacción para obtener el usuario: ${error}`);
        }
    }

    async updateUserToken(userId: number, token: string) {
        try {
            const connection = mySqlDB.getConnection();

            await connection.execute('UPDATE `users` SET `token` = ? WHERE id = ?', [token, userId]);
        } catch (error) {
            logger.error(`Error while trying to update user's token`, error);
            throw new Error(`Error en la transacción para actualizar el token del usuario: ${error}`);
        }
    }
}

const userService = new UserService();
export default userService;
