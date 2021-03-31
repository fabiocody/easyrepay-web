import {Injectable, Injector} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiService, LoginStatus} from './api.service';
import {catchError, switchMap} from 'rxjs/operators';

@Injectable()
export class RequestInterceptorService implements HttpInterceptor {
    constructor(
        private injector: Injector,
        private apiService: ApiService,
    ) {}

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.indexOf('/auth/') < 0 && req.url.indexOf('/i18n/') < 0) {
            req = this.addTokenToRequest(req);
        }
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error && error.status === 401 && req.url.indexOf('/auth/') < 0) {
                    this.apiService.loginStatusSubject.next(LoginStatus.TOKEN_EXPIRED);
                    return this.apiService.refreshToken().pipe(
                        switchMap(() => next.handle(this.addTokenToRequest(req))),
                        catchError(refreshError => {
                            this.apiService.loginStatusSubject.next(LoginStatus.LOGGED_OUT);
                            throw refreshError;
                        })
                    );
                }
                throw error;
            })
        );
    }

    private addTokenToRequest(req: HttpRequest<any>): HttpRequest<any> {
        return req.clone({
            headers: req.headers.set('Authorization', this.apiService.authHeader)
        });
    }
}
