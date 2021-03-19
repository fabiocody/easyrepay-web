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
  private token: string | null;
  private refresh: string | null;
  private authHeader = {Authorization: ''};

  constructor(
    private http: HttpClient,
  ) {
    this.token = localStorage.getItem('token');
    this.refresh = localStorage.getItem('refresh');
    if (this.token) {
      this.authHeader.Authorization = 'Bearer ' + this.token;
    }
  }

  public hasToken(): boolean {
    return this.token !== null;
  }

  public login(loginDto: LoginDto): Observable<TokenDto> {
    return this.http.post<TokenDto>(environment.apiUrl + '/api/token', loginDto)
      .pipe(
        map(login => {
          console.log('LOGIN', login);
          this.token = login.access;
          localStorage.setItem('token', this.token);
          this.refresh = login.refresh;
          localStorage.setItem('refresh', this.refresh);
          this.authHeader.Authorization = 'Bearer ' + login.access;
          return login;
        })
      );
  }

  public logout(): void {
    this.token = null;
    localStorage.removeItem('token');
    this.refresh = null;
    localStorage.removeItem('refresh');
    this.authHeader.Authorization = '';
    this.refresh = null;
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
