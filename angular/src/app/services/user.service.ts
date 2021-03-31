import {Injectable} from '@angular/core';
import {ApiService, LoginStatus} from './api.service';
import {BehaviorSubject} from 'rxjs';
import {UserDto} from '../../../../src/model/dto/user.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<UserDto | null | undefined>(undefined);
  public user = this.userSubject.asObservable();

  constructor(
    private apiService: ApiService,
  ) {
    this.apiService.loginStatus.subscribe(status => {
      switch (status) {
        case LoginStatus.LOGGED_IN:
          this.apiService.getUserInfo().subscribe(user => this.userSubject.next(user));
          break;
        case LoginStatus.LOGGED_OUT:
          this.userSubject.next(null);
          break;
        case LoginStatus.TOKEN_EXPIRED:
          this.apiService.refreshToken().subscribe();
          break;
        default:
          this.userSubject.next(undefined);
      }
    });
  }

  public login(username: string, password: string): void {
    this.apiService.login(username, password).subscribe(_ => {
      this.apiService.getUserInfo().subscribe(user => {
        this.userSubject.next(user);
      }, error => {
        console.error(error);
        this.userSubject.next(null);
      });
    }, error => {
      console.error(error);
      this.userSubject.next(null);
    });
  }

  public logout(): void {
    this.apiService.logout();
    this.userSubject.next(null);
  }
}
