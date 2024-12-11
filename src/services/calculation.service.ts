import type { ResultSetHeader } from 'mysql2';

import mySqlDB from '@vote-seat-api/db/mysql';
import logger from '@vote-seat-api/helpers/logger';
import type {
    CalculationRowRecord,
    HistoryRecord,
    PartyList,
    PartyListWithSeats,
} from '@vote-seat-api/types/calculation.types';

class CalculationService {
    calculate(seats: number, partiesLists: PartyList[]): PartyListWithSeats[] {
        const results = partiesLists.map((partyList) => ({ name: partyList.name, votes: partyList.votes, seats: 0 }));
        // Creo una lista de prioridad en base al cociente de cada lista.
        const priorityQueue = partiesLists.map((partyList) => ({
            name: partyList.name,
            votes: partyList.votes,
            quotient: partyList.votes,
        }));

        for (let i = 0; i < seats; i++) {
            // Ordeno por mayor cociente, eso me da el ganador por cada iteración.
            priorityQueue.sort((a, b) => b.quotient - a.quotient);
            const winner = priorityQueue[0];

            // Busco la lista en el array de resultados y le sumo un escaño.
            const result = results.find((res) => res.name === winner.name);

            if (result) {
                result.seats += 1;
                // Recalculo el cociente para obtener el proximo ganador.
                winner.quotient = winner.votes / (result.seats + 1);
            }
        }
        return results;
    }

    async save(seats: number, partiesListsWithSeats: PartyListWithSeats[]) {
        try {
            const connection = mySqlDB.getConnection();

            const [result] = await connection.execute<ResultSetHeader>(
                'INSERT INTO `calculations` (`seats`, `list_quantity`) VALUES (?, ?)',
                [seats, partiesListsWithSeats.length],
            );
            const calculationId = result.insertId;

            await Promise.all(
                partiesListsWithSeats.map((partyList) =>
                    connection.query(
                        'INSERT INTO `calculation_lists` (`calculation_id`, `name`, `votes`, `seats`) VALUES (?, ?, ?, ?)',
                        [calculationId, partyList.name, partyList.votes, partyList.seats],
                    ),
                ),
            );
            return calculationId;
        } catch (error) {
            logger.error('Error while trying to realize dhondt calculation', error);
            throw new Error(`Error en la transacción de guardado del cálculo: ${error}`);
        }
    }

    async fetchAll() {
        try {
            const connection = mySqlDB.getConnection();

            const [rows] = await connection.query<CalculationRowRecord[]>(
                `SELECT 
                    calc.id AS calculation_id,
                    calc.seats,
                    calc.list_quantity,
                    calc.created_at,
                    list.name AS list_name,
                    list.votes AS list_votes,
                    list.seats AS list_seats
                 FROM 
                    calculations calc
                 LEFT JOIN 
                    calculation_lists list ON calc.id = list.calculation_id
                 ORDER BY 
                    calc.created_at DESC`,
            );

            const history = rows.reduce((acc, row) => {
                const existingCalculation = acc.find((c) => c.id === row.calculation_id);

                if (existingCalculation) {
                    existingCalculation.partiesLists.push({
                        name: row.list_name,
                        votes: row.list_votes,
                        seats: row.list_seats,
                    });
                } else {
                    acc.push({
                        id: row.calculation_id,
                        seats: row.seats,
                        listQuantity: row.list_quantity,
                        createdAt: row.created_at,
                        partiesLists: [{ name: row.list_name, votes: row.list_votes, seats: row.list_seats }],
                    });
                }
                return acc;
            }, [] as HistoryRecord[]);

            return history;
        } catch (error) {
            logger.error('Error while trying to get calculation history', error);
            throw new Error(`Error en la transacción para obtener el historial de cálculos: ${error}`);
        }
    }
}

const calculationService = new CalculationService();
export default calculationService;
