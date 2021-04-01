import {Request, Response} from 'express';
import {TransactionService} from '../services/transaction.service';
import {TransactionDto} from '../model/dto/transaction.dto';
import {validateOrReject, ValidationError} from 'class-validator';

export class TransactionController {
    public static async getTransactions(req: Request, res: Response): Promise<void> {
        try {
            const personId = parseInt(req.params.id, 10);
            const completed = req.query.completed ? JSON.parse(req.query.completed as string) : false;
            const transactions = (await TransactionService.getTransactions(personId, completed))
                .map(t => new TransactionDto(t));
            res.send(transactions);
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }

    public static async saveTransaction(req: Request, res: Response): Promise<void> {
        try {
            const transaction = new TransactionDto(req.body);
            await validateOrReject(transaction);
            await TransactionService.save(transaction);
            res.send();
        } catch (e) {
            console.error(e);
            res.sendStatus((e instanceof ValidationError || e[0] instanceof ValidationError) ? 400 : 500);
        }
    }

    public static async deleteAllTransactions(req: Request, res: Response): Promise<void> {
        try {
            const personId = parseInt(req.params.id, 10);
            await TransactionService.deleteAll(personId);
            res.send();
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }

    public static async setCompleted(req: Request, res: Response): Promise<void> {
        try {
            const personId = parseInt(req.params.id, 10);
            await TransactionService.setCompleted(personId);
            res.send();
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }

    public static async deleteCompleted(req: Request, res: Response): Promise<void> {
        try {
            const personId = parseInt(req.params.id, 10);
            await TransactionService.deleteCompleted(personId);
            res.send();
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }

    public static async deleteTransaction(req: Request, res: Response): Promise<void> {
        try {
            const transactionId = parseInt(req.params.id, 10);
            await TransactionService.delete(transactionId);
            res.send();
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }
}
