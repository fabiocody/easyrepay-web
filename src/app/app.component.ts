import { Component } from '@angular/core';
import {Theme, ThemeService} from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'EasyRepay';

  constructor(
    private themeService: ThemeService,
  ) {}

  public getTheme(): Theme {
    return this.themeService.getTheme();
  }
}
