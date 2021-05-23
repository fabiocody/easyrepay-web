import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {TokenDto} from '../../../../src/model/dto/token.dto';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {UserDto} from '../../../../src/model/dto/user.dto';
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

    public login(username: string, password: string): Promise<TokenDto> {
        return this.http.post<TokenDto>(environment.apiUrl + '/api/auth/authenticate', {}, {
            headers: {
                authorization: 'Basic ' + window.btoa(username + ':' + password)
            }
        }).pipe(
            map(tokenDto => {
                this.saveTokens(tokenDto.access, tokenDto.refresh);
                return tokenDto;
            })
        ).toPromise();
    }

    public logout(): void {
        this.saveTokens(null, null);
    }

    public refreshToken(): Promise<TokenDto> {
        const refreshTokenDto: RefreshTokenDto = {token: this.refresh!};
        return this.http.post<TokenDto>(environment.apiUrl + '/api/auth/refresh-token', refreshTokenDto).pipe(
            map(tokenDto => {
                this.saveTokens(tokenDto.access, tokenDto.refresh);
                return tokenDto;
            })
        ).toPromise();
    }

    public getUserInfo(): Promise<UserDto> {
        return this.http.get<UserDto>(environment.apiUrl + '/api/me').toPromise();
    }
}
