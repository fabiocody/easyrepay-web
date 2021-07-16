import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {from, Observable} from 'rxjs';
import {LoginService, LoginStatus} from '../../login/login.service';
import {catchError, switchMap} from 'rxjs/operators';

@Injectable()
export class RequestInterceptorService implements HttpInterceptor {
    constructor(private loginService: LoginService) {}

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const nonAuthenticatedPaths = ['auth/login', 'auth/refresh-token', 'assets'];
        if (nonAuthenticatedPaths.filter(path => req.url.indexOf(path) >= 0).length === 0) {
            req = this.addTokenToRequest(req);
        }
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error && error.status === 401 && req.url.indexOf('/auth/') < 0) {
                    console.log('Automatically refreshing token');
                    return from(this.loginService.refreshToken()).pipe(
                        switchMap(() => next.handle(this.addTokenToRequest(req))),
                        catchError(refreshError => {
                            this.loginService.setLoginStatus(LoginStatus.LOGGED_OUT);
                            throw refreshError;
                        }),
                    );
                }
                throw error;
            }),
        );
    }

    private addTokenToRequest(req: HttpRequest<any>): HttpRequest<any> {
        return req.clone({
            headers: req.headers.set('Authorization', this.loginService.authHeader),
        });
    }
}
