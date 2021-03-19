import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TokenDto} from '../model/dto/token-dto';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {User} from '../model/user';
import {PersonDto} from '../model/dto/person-dto';
import {LoginDto} from '../model/dto/login-dto';
import {AddPersonDto} from '../model/dto/add-person-dto';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private token: string | null = null;
  private refresh: string | null = null;
  private authHeader = {Authorization: ''};

  constructor(
    private http: HttpClient,
  ) {
    this.saveTokens(localStorage.getItem('token'), localStorage.getItem('refresh'));
    this.refreshToken().subscribe(tokenDto => {
      this.saveTokens(tokenDto.access, tokenDto.refresh);
    });
  }

  public hasToken(): boolean {
    return this.token !== null;
  }

  private saveTokens(access: string | null, refresh: string | null): void {
    this.token = access;
    if (access) {
      localStorage.setItem('token', access);
      this.authHeader.Authorization = 'Bearer ' + access;
    } else {
      localStorage.removeItem('token');
      this.authHeader.Authorization = '';
    }
    this.refresh = refresh;
    if (refresh) {
      localStorage.setItem('refresh', refresh);
    } else {
      localStorage.removeItem('refresh');
    }
  }

  public login(loginDto: LoginDto): Observable<TokenDto> {
    return this.http.post<TokenDto>(environment.apiUrl + '/api/token', loginDto)
      .pipe(
        map(tokenDto => {
          this.saveTokens(tokenDto.access, tokenDto.refresh);
          return tokenDto;
        })
      );
  }

  public logout(): void {
    this.saveTokens(null, null);
  }

  private refreshToken(): Observable<TokenDto> {
    return this.http.post<TokenDto>(environment.apiUrl + '/api/token/refresh', {
      refresh: this.refresh
    });
  }

  public getUserInfo(): Observable<User> {
    return this.http.get<User>(environment.apiUrl + '/api/me', {
      headers: this.authHeader
    });
  }

  public getPeople(): Observable<PersonDto[]> {
    return this.http.get<PersonDto[]>(environment.apiUrl + '/api/people', {
      headers: this.authHeader
    });
  }

  public addPerson(personDto: AddPersonDto): Observable<any> {
    return this.http.post(environment.apiUrl + '/api/people', personDto, {
      headers: this.authHeader
    });
  }

  public getPerson(id: number): Observable<PersonDto> {
    return this.http.get<PersonDto>(environment.apiUrl + `/api/people/${id}`, {
      headers: this.authHeader
    });
  }
}
