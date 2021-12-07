import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserDto} from '../../model/user.dto';
import {SubSink} from 'subsink';
import {Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {TokenDto} from '../../model/token.dto';
import {RefreshTokenDto} from '../../model/refresh-token.dto';

export enum LoginStatus {
    LOGGED_OUT,
    TOKEN_EXPIRED,
    LOGGED_IN,
}

@Injectable({
    providedIn: 'root',
})
export class LoginService implements OnDestroy {
    public loginStatus: Observable<LoginStatus>;
    private access: string | null = localStorage.getItem('access');
    private refresh: string | null = localStorage.getItem('refresh');
    private loginStatusSubject: BehaviorSubject<LoginStatus>;
    private userSubject = new BehaviorSubject<UserDto | null | undefined>(undefined);
    public user = this.userSubject.asObservable();
    private subs = new SubSink();

    constructor(private router: Router, private http: HttpClient) {
        let initialStatus = LoginStatus.LOGGED_OUT;
        if (this.access) {
            const jwt = new JwtHelperService();
            initialStatus = jwt.isTokenExpired(this.access) ? LoginStatus.TOKEN_EXPIRED : LoginStatus.LOGGED_IN;
        }
        this.loginStatusSubject = new BehaviorSubject<LoginStatus>(initialStatus);
        this.loginStatus = this.loginStatusSubject.asObservable();
        setTimeout(() => {
            this.subs.sink = this.loginStatus.subscribe(status => {
                switch (status) {
                    case LoginStatus.LOGGED_IN:
                        this.getUserInfo()
                            .then(user => this.userSubject.next(user))
                            .catch(error => {
                                console.error(error);
                                this.userSubject.next(null);
                            });
                        break;
                    case LoginStatus.LOGGED_OUT:
                        this.userSubject.next(null);
                        break;
                    case LoginStatus.TOKEN_EXPIRED:
                        this.refreshToken().catch(error => {
                            console.error(error);
                            this.userSubject.next(null);
                        });
                        break;
                    default:
                        this.userSubject.next(undefined);
                }
            });
        }, 0);
    }

    public get authHeader(): string {
        return 'Bearer ' + this.access;
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public setLoginStatus(value: LoginStatus): void {
        this.loginStatusSubject.next(value);
    }

    public async login(username: string, password: string): Promise<void> {
        try {
            const tokens = await this.http
                .post<TokenDto>(
                    '/api/auth/login',
                    {},
                    {
                        headers: {authorization: 'Basic ' + window.btoa(`${username}:${password}`)},
                    },
                )
                .toPromise();
            this.saveTokens(tokens.access, tokens.refresh);
            await this.router.navigate(['/people']);
        } catch (e) {
            console.error(e);
            this.userSubject.next(null);
        }
    }

    public logout(): void {
        const refreshTokenDto = new RefreshTokenDto({token: this.refresh!});
        this.http.post('/api/auth/logout', refreshTokenDto).toPromise().then();
        this.saveTokens(null, null);
    }

    public async refreshToken(): Promise<TokenDto> {
        const refreshTokenDto = new RefreshTokenDto({token: this.refresh!});
        const tokens = await this.http.post<TokenDto>('/api/auth/refresh-token', refreshTokenDto).toPromise();
        this.saveTokens(tokens.access, tokens.refresh);
        return tokens;
    }

    public getUserInfo(): Promise<UserDto> {
        return this.http.get<UserDto>('/api/user').toPromise();
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
}
