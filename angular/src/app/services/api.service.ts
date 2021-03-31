import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {TokenDto} from '../../../../src/model/dto/token.dto';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {UserDto} from '../../../../src/model/dto/user.dto';
import {PersonDetailDto} from '../../../../src/model/dto/person-detail.dto';
import {AddPersonDto} from '../../../../src/model/dto/add-person.dto';
import {Transaction} from '../model/transaction';
import {RefreshTokenDto} from '../../../../src/model/dto/refresh-token.dto';
import {JwtHelperService} from '@auth0/angular-jwt';

export enum LoginStatus {
  LOGGED_OUT,
  TOKEN_EXPIRED,
  LOGGED_IN
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private access: string | null = localStorage.getItem('access');
  private refresh: string | null = localStorage.getItem('refresh');
  public loginStatusSubject: BehaviorSubject<LoginStatus>;
  public loginStatus: Observable<LoginStatus>;

  constructor(
    private http: HttpClient,
  ) {
    let status = LoginStatus.LOGGED_OUT;
    if (this.access) {
      const jwt = new JwtHelperService();
      status = jwt.isTokenExpired(this.access) ? LoginStatus.TOKEN_EXPIRED : LoginStatus.LOGGED_IN;
    }
    this.loginStatusSubject = new BehaviorSubject<LoginStatus>(status);
    this.loginStatus = this.loginStatusSubject.asObservable();
  }

  public get authHeader(): string {
    return 'Bearer ' + this.access;
  }

  private saveTokens(access: string | null, refresh: string | null): void {
    this.access = access;
    this.refresh = refresh;
    if (access) {
      localStorage.setItem('access', access);
      this.loginStatusSubject.next(LoginStatus.LOGGED_IN);
    } else {
      localStorage.removeItem('access');
      this.loginStatusSubject.next(LoginStatus.LOGGED_OUT);
    }
    if (refresh) {
      localStorage.setItem('refresh', refresh);
    } else {
      localStorage.removeItem('refresh');
    }
  }

  public login(username: string, password: string): Observable<TokenDto> {
    return this.http.post<TokenDto>(environment.apiUrl + '/api/auth/authenticate', {}, {
      headers: {
        authorization: 'Basic ' + window.btoa(username + ':' + password)
      }
    }).pipe(
      map(tokenDto => {
        this.saveTokens(tokenDto.access, tokenDto.refresh);
        return tokenDto;
      })
    );
  }

  public logout(): void {
    this.saveTokens(null, null);
  }

  public refreshToken(): Observable<TokenDto> {
    const refreshTokenDto: RefreshTokenDto = {token: this.refresh!};
    return this.http.post<TokenDto>(environment.apiUrl + '/api/auth/refresh-token', refreshTokenDto).pipe(
      map(tokenDto => {
        this.saveTokens(tokenDto.access, tokenDto.refresh);
        return tokenDto;
      })
    );
  }

  public getUserInfo(): Observable<UserDto> {
    return this.http.get<UserDto>(environment.apiUrl + '/api/me');
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
