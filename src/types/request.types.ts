import type { Request } from 'express';

import type { PartyList } from '@vote-seat-api/types/calculation.types';

export type LoginRequest = Request & {
    body: {
        username: string;
        password: string;
    };
};

export type ApiRequest = Request & {
    user: {
        id: number;
        username: string;
    };
};

export type CalculateRequest = ApiRequest & {
    body: {
        seats: number;
        partiesLists: PartyList[];
        save: boolean;
    };
};
