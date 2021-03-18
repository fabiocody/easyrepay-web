import {Component} from '@angular/core';
import {UserService} from './services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'EasyRepay';
  public loading = true;

  constructor(
    private router: Router,
    private userService: UserService,
  ) {
    this.userService.user.subscribe(user => {
      if (user) {
        this.router.navigate(['/people']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
