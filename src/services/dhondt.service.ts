import type { ResultSetHeader } from 'mysql2';

import mySqlDB from '@vote-seat-api/db/mysql';
import logger from '@vote-seat-api/helpers/logger';
import type {
    CalculationWithListRow,
    DhondtHistory,
    List,
    ListWithCalculatedSeats,
} from '@vote-seat-api/types/dhondt.types';

class DhondtService {
    calculate(seats: number, lists: List[]): ListWithCalculatedSeats[] {
        const results = lists.map((list) => ({ name: list.name, votes: list.votes, seats: 0 }));
        // Creo una lista de prioridad en base al cociente de cada lista.
        const priorityQueue = lists.map((list) => ({
            name: list.name,
            votes: list.votes,
            quotient: list.votes,
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

    async save(seats: number, listsWithCalculatedSeats: ListWithCalculatedSeats[]) {
        const connection = mySqlDB.getConnection();

        try {
            const [result] = await connection.execute<ResultSetHeader>(
                'INSERT INTO `calculations` (`seats`, `list_quantity`) VALUES (?, ?)',
                [seats, listsWithCalculatedSeats.length],
            );
            const calculationId = result.insertId;

            await Promise.all(
                listsWithCalculatedSeats.map((list) =>
                    connection.query(
                        'INSERT INTO `calculation_lists` (`calculation_id`, `name`, `votes`, `seats`) VALUES (?, ?, ?, ?)',
                        [calculationId, list.name, list.votes, list.seats],
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
        const connection = mySqlDB.getConnection();

        const [rows] = await connection.query<CalculationWithListRow[]>(
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
                existingCalculation.lists.push({
                    name: row.list_name,
                    votes: row.list_votes,
                    seats: row.list_seats,
                });
            } else {
                acc.push({
                    id: row.calculation_id,
                    seats: row.seats,
                    list_quantity: row.list_quantity,
                    created_at: row.created_at,
                    lists: [{ name: row.list_name, votes: row.list_votes, seats: row.list_seats }],
                });
            }
            return acc;
        }, [] as DhondtHistory[]);

        return history;
    }
}

const dhondtService = new DhondtService();
export default dhondtService;
