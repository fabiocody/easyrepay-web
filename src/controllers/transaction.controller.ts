import {Request, Response} from "express";
import {TransactionService} from "../services/transaction.service";

export class TransactionController {
    public static async getTransactions(req: Request, res: Response): Promise<void> {
        try {
            const personId = parseInt(req.params.id);
            const transactions = await TransactionService.getTransactions(personId);
            res.send(transactions);
        } catch {
            res.sendStatus(500);
        }
    }

    public static addOrUpdateTransaction(req: Request, res: Response): void {
        res.send();
    }

    public static deleteAllTransactions(req: Request, res: Response): void {
        res.send();
    }

    public static setCompleted(req: Request, res: Response): void {
        res.send();
    }

    public static deleteCompleted(req: Request, res: Response): void {
        res.send();
    }

    public static deleteTransaction(req: Request, res: Response): void {
        res.send();
    }
}
