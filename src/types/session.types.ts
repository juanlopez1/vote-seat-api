import type { RowDataPacket } from 'mysql2';

export type User = RowDataPacket & {
    id: number;
    username: string;
    password: string;
    token: string;
};
