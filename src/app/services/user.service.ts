import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {BehaviorSubject} from 'rxjs';
import {User} from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private user = this.userSubject.asObservable();

  constructor(
    private apiService: ApiService,
  ) {}

  public getUser(): User | null {
    return this.userSubject.value;
  }

  public isLogged(): boolean {
    return this.getUser() !== null;
  }

  public login(username: string, password: string): void {
    this.apiService.authenticate(username, password).subscribe(logged => {
      if (logged) {
        console.log('LOGGED');
        this.apiService.getUserInfo().subscribe(user => {
          console.log('USER', user);
          this.userSubject.next(user);
        }, error => console.error(error));
      } else {
        console.log('NOT LOGGED');
      }
    }, error => console.error(error));
  }
}
