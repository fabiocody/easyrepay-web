import {Injectable, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService, LoginStatus} from './api.service';
import {BehaviorSubject} from 'rxjs';
import {UserDto} from '../../../../src/model/dto/user.dto';
import {SubSink} from 'subsink';

@Injectable({
    providedIn: 'root'
})
export class UserService implements OnDestroy {
    private userSubject = new BehaviorSubject<UserDto | null | undefined>(undefined);
    public user = this.userSubject.asObservable();
    private subs = new SubSink();

    constructor(
        private router: Router,
        private apiService: ApiService,
    ) {
        this.subs.sink = this.apiService.loginStatus.subscribe(status => {
            switch (status) {
                case LoginStatus.LOGGED_IN:
                    this.apiService.getUserInfo()
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
                    this.apiService.refreshToken().catch(error => {
                        console.error(error);
                        this.userSubject.next(null);
                    });
                    break;
                default:
                    this.userSubject.next(undefined);
            }
        });
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public async login(username: string, password: string): Promise<void> {
        try {
            await this.apiService.login(username, password);
            const user = await this.apiService.getUserInfo();
            this.userSubject.next(user);
            this.router.navigate(['/people']).then();
        } catch (e) {
            console.error(e);
            this.userSubject.next(null);
        }
    }

    public logout(): void {
        this.apiService.logout();
        this.userSubject.next(null);
    }
}
