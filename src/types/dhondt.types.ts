import type { Request } from 'express';
import type { RowDataPacket } from 'mysql2';

export type List = {
    name: string;
    votes: number;
};

export type ListWithCalculatedSeats = List & {
    seats: number;
};

export type CalculationWithListRow = RowDataPacket & {
    calculation_id: number;
    seats: number;
    list_quantity: number;
    created_at: string;
    list_name: string;
    list_votes: number;
    list_seats: number;
};

export type DhondtHistory = {
    id: number;
    seats: number;
    list_quantity: number;
    created_at: string;
    lists: ListWithCalculatedSeats[];
};

export type CalculateRequest = Request<
    Record<string, never>,
    Record<string, never>,
    {
        seats: number;
        lists: List[];
        save: boolean;
    }
>;
