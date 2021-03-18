import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {BehaviorSubject} from 'rxjs';
import {User} from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user = this.userSubject.asObservable();

  constructor(
    private apiService: ApiService,
  ) {
    if (this.apiService.hasToken()) {
      this.apiService.getUserInfo().subscribe(user => {
        this.userSubject.next(user);
      });
    } else {
      this.userSubject.next(null);
    }
  }

  public login(username: string, password: string): void {
    this.apiService.login(username, password).subscribe(login => {
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
