import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {TransactionDto} from '../../../../src/model/dto/transaction.dto';

@Injectable()
export class TransactionsService {
    constructor(private http: HttpClient) {}

    public getTransactions(personId: number, completed: boolean): Promise<TransactionDto[]> {
        const params = new HttpParams().set('personId', personId).set('completed', completed);
        return this.http.get<TransactionDto[]>(`/api/transaction`, {params}).toPromise();
    }

    public saveTransaction(transaction: TransactionDto): Promise<any> {
        return this.http.post(`/api/transaction`, transaction).toPromise();
    }

    public deleteAllTransactions(personId: number): Promise<any> {
        const params = new HttpParams().set('personId', personId);
        return this.http.delete(`/api/transaction`, {params}).toPromise();
    }

    public completeAllTransactions(personId: number): Promise<any> {
        const params = new HttpParams().set('personId', personId);
        return this.http.post(`/api/transaction/complete`, {}, {params}).toPromise();
    }

    public deleteCompletedTransactions(personId: number): Promise<any> {
        const params = new HttpParams().set('personId', personId);
        return this.http.delete(`/api/transaction/complete`, {params}).toPromise();
    }

    public getTransaction(transactionId: number): Promise<TransactionDto> {
        return this.http.get<TransactionDto>(`/api/transaction/${transactionId}`).toPromise();
    }

    public deleteTransaction(personId: number, transactionId: number): Promise<any> {
        return this.http.delete(`/api/transaction/${transactionId}`).toPromise();
    }
}
