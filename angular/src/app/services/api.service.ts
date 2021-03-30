import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {TokenDto} from '../model/dto/token-dto';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {User} from '../model/user';
import {PersonDetailDto} from '../../../../src/model/dto/person-detail.dto';
import {LoginDto} from '../model/dto/login-dto';
import {AddPersonDto} from '../model/dto/add-person-dto';
import {Transaction} from '../model/transaction';

export enum LoginStatus {
  LOGGED_OUT,
  TOKEN_EXPIRED,
  LOGGED_IN
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private token: string | null = null;
  public loginStatusSubject = new BehaviorSubject<LoginStatus>(LoginStatus.LOGGED_OUT);
  public loginStatus = this.loginStatusSubject.asObservable();

  constructor(
    private http: HttpClient,
  ) {
    this.saveTokens(localStorage.getItem('token'));
  }

  public get authHeader(): string {
    return 'Bearer ' + this.token;
  }

  private saveTokens(access: string | null): void {
    this.token = access;
    if (access) {
      localStorage.setItem('token', access);
      this.loginStatusSubject.next(LoginStatus.LOGGED_IN);
    } else {
      localStorage.removeItem('token');
      this.loginStatusSubject.next(LoginStatus.LOGGED_OUT);
    }
  }

  public login(loginDto: LoginDto): Observable<TokenDto> {
    return this.http.post<TokenDto>(environment.apiUrl + '/api/auth/authenticate', loginDto)
      .pipe(
        map(tokenDto => {
          this.saveTokens(tokenDto.access);
          return tokenDto;
        })
      );
  }

  public logout(): void {
    this.saveTokens(null);
  }

  public refreshToken(): Observable<TokenDto> {
    return this.http.post<TokenDto>(environment.apiUrl + '/api/auth/refresh-token', {}).pipe(
      map(tokenDto => {
        this.saveTokens(tokenDto.access);
        return tokenDto;
      })
    );
  }

  public getUserInfo(): Observable<User> {
    return this.http.get<User>(environment.apiUrl + '/api/me');
  }

  public getPeople(): Observable<PersonDetailDto[]> {
    return this.http.get<PersonDetailDto[]>(environment.apiUrl + '/api/people');
  }

  public addPerson(personDto: AddPersonDto): Observable<any> {
    return this.http.post(environment.apiUrl + '/api/people', personDto);
  }

  public getPerson(personId: number): Observable<PersonDetailDto> {
    return this.http.get<PersonDetailDto>(environment.apiUrl + `/api/person/${personId}`);
  }

  public editPerson(personId: number, personDto: AddPersonDto): Observable<any> {
    return this.http.post(environment.apiUrl + `/api/person/${personId}`, personDto);
  }

  public deletePerson(personId: number): Observable<any> {
    return this.http.delete(environment.apiUrl + `/api/person/${personId}`);
  }

  public getTransactions(personId: number, completed: boolean): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(environment.apiUrl + `/api/person/${personId}/transactions?completed=${completed}`);
  }

  public saveTransaction(transaction: Transaction): Observable<any> {
    return this.http.post(environment.apiUrl + `/api/person/${transaction.person}/transactions`, transaction);
  }

  public deleteTransaction(personId: number, transactionId: number): Observable<any> {
    return this.http.delete(environment.apiUrl + `/api/transaction/${transactionId}`);
  }

  public completeAllTransactions(personId: number): Observable<any> {
    return this.http.post(environment.apiUrl + `/api/person/${personId}/transactions/complete`, {});
  }

  public deleteAllTransactions(personId: number): Observable<any> {
    return this.http.delete(environment.apiUrl + `/api/person/${personId}/transactions`);
  }

  public deleteCompletedTransactions(personId: number): Observable<any> {
    return this.http.delete(environment.apiUrl + `/api/person/${personId}/transactions/complete`);
  }
}
