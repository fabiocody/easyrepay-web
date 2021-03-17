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
    }
  }

  public getUser(): User | null {
    return this.userSubject.value;
  }

  public isLogged(): boolean {
    return this.getUser() !== null;
  }

  public login(username: string, password: string): void {
    this.apiService.login(username, password).subscribe(login => {
      console.log('LOGGED');
      this.apiService.getUserInfo().subscribe(user => {
        console.log('USER', user);
        this.userSubject.next(user);
      }, error => console.error(error));
    }, error => console.error(error));
  }

  public logout(): void {
    this.apiService.logout();
    this.userSubject.next(null);
  }
}
