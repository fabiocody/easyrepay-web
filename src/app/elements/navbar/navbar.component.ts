import {Component, Input, OnInit} from '@angular/core';
import {Theme, ThemeOption, ThemeService} from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() public title = '';

  constructor(private themeService: ThemeService) {
  }

  ngOnInit(): void {
  }

  public getThemes(): ThemeOption[] {
    return this.themeService.THEMES;
  }

  public setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }
}
