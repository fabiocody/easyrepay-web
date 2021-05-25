import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TransactionDto} from '../../../../src/model/dto/transaction.dto';

@Injectable()
export class TransactionsService {
    constructor(
        private http: HttpClient,
    ) {}

    public getTransactions(personId: number, completed: boolean): Promise<TransactionDto[]> {
        const params = `completed=${completed}`;
        return this.http.get<TransactionDto[]>(environment.apiUrl + `/api/person/${personId}/transactions?${params}`).toPromise();
    }

    public deleteAllTransactions(personId: number): Promise<object> {
        return this.http.delete(environment.apiUrl + `/api/person/${personId}/transactions`).toPromise();
    }

    public completeAllTransactions(personId: number): Promise<object> {
        return this.http.post(environment.apiUrl + `/api/person/${personId}/transactions/complete`, {}).toPromise();
    }

    public deleteCompletedTransactions(personId: number): Promise<object> {
        return this.http.delete(environment.apiUrl + `/api/person/${personId}/transactions/complete`).toPromise();
    }

    public saveTransaction(transaction: TransactionDto): Promise<object> {
        return this.http.post(environment.apiUrl + `/api/transactions`, transaction).toPromise();
    }

    public deleteTransaction(personId: number, transactionId: number): Promise<object> {
        return this.http.delete(environment.apiUrl + `/api/transaction/${transactionId}`).toPromise();
    }

    public getTransaction(transactionId: number): Promise<TransactionDto> {
        return this.http.get<TransactionDto>(environment.apiUrl + `/api/transaction/${transactionId}`).toPromise();
    }
}