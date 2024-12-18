import type { RowDataPacket } from 'mysql2';

export type PartyList = {
    name: string;
    votes: number;
};

export type PartyListWithSeats = PartyList & {
    seats: number;
};

export type HistoryRecord = {
    id: number;
    seats: number;
    listQuantity: number;
    createdAt: string;
    partiesLists: PartyListWithSeats[];
};

export type CalculationRowRecord = RowDataPacket & {
    calculation_id: number;
    seats: number;
    list_quantity: number;
    created_at: string;
    list_name: string;
    list_votes: number;
    list_seats: number;
};
