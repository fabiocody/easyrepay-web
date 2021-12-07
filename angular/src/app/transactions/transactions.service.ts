import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {TransactionDto} from '../../model/transaction.dto';

@Injectable()
export class TransactionsService {
    constructor(private http: HttpClient) {}

    public getTransactions(personId: number, completed: boolean): Promise<TransactionDto[]> {
        const params = new HttpParams().set('personId', personId).set('completed', completed);
        return this.http.get<TransactionDto[]>(`/api/transactions`, {params}).toPromise();
    }

    public saveTransaction(transaction: TransactionDto): Promise<any> {
        return this.http.post(`/api/transactions`, transaction).toPromise();
    }

    public deleteAllTransactions(personId: number): Promise<any> {
        const params = new HttpParams().set('personId', personId);
        return this.http.delete(`/api/transactions`, {params}).toPromise();
    }

    public completeAllTransactions(personId: number): Promise<any> {
        const params = new HttpParams().set('personId', personId);
        return this.http.post(`/api/transactions/set-completed`, {}, {params}).toPromise();
    }

    public deleteCompletedTransactions(personId: number): Promise<any> {
        const params = new HttpParams().set('personId', personId);
        return this.http.delete(`/api/transactions/delete-completed`, {params}).toPromise();
    }

    public deleteTransaction(personId: number, transactionId: number): Promise<any> {
        return this.http.delete(`/api/transaction/${transactionId}`).toPromise();
    }
}
