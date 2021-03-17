import {Component, Input, OnInit} from '@angular/core';
import {Theme, ThemeOption, ThemeService} from '../../services/theme.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() public title = '';
  public userName = '';

  constructor(
    private themeService: ThemeService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.userService.user.subscribe(user => {
      if (user) {
        this.userName = user.first_name + ' ' + user.last_name;
      } else {
        this.userName = '';
      }
    });
  }

  public getThemes(): ThemeOption[] {
    return this.themeService.THEMES;
  }

  public setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  public logout(): void {
    console.log('LOGOUT');
    this.userService.logout();
  }
}
