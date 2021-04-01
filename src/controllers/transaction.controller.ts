import {Request, Response} from 'express';
import {TransactionService} from '../services/transaction.service';
import {TransactionDto} from '../model/dto/transaction.dto';

export class TransactionController {
    public static async getTransactions(req: Request, res: Response): Promise<void> {
        try {
            const personId = parseInt(req.params.id, 10);
            let completed = false;
            if (req.query.completed) {
                completed = JSON.parse(req.query.completed as string);
            }
            const transactions = await TransactionService.getTransactions(personId, completed);
            res.send(transactions);
        } catch {
            res.sendStatus(500);
        }
    }

    public static async saveTransaction(req: Request, res: Response): Promise<void> {
        try {
            const transaction = req.body as TransactionDto;
            await TransactionService.save(transaction);
            res.send();
        } catch {
            res.sendStatus(500);
        }
    }

    public static async deleteAllTransactions(req: Request, res: Response): Promise<void> {
        try {
            const personId = parseInt(req.params.id, 10);
            await TransactionService.deleteAll(personId);
            res.send();
        } catch {
            res.sendStatus(500);
        }
    }

    public static async setCompleted(req: Request, res: Response): Promise<void> {
        try {
            const personId = parseInt(req.params.id, 10);
            await TransactionService.setCompleted(personId);
            res.send();
        } catch {
            res.sendStatus(500);
        }
    }

    public static async deleteCompleted(req: Request, res: Response): Promise<void> {
        try {
            const personId = parseInt(req.params.id, 10);
            await TransactionService.deleteCompleted(personId);
            res.send();
        } catch {
            res.sendStatus(500);
        }
    }

    public static async deleteTransaction(req: Request, res: Response): Promise<void> {
        try {
            const transactionId = parseInt(req.params.id, 10);
            await TransactionService.delete(transactionId);
            res.send();
        } catch {
            res.sendStatus(500);
        }
    }
}
