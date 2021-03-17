import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

export interface ThemeOption {
  label: Theme;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject: BehaviorSubject<Theme>;
  public theme: Observable<Theme>;

  constructor() {
    const item = localStorage.getItem('theme') || Theme.LIGHT;
    this.themeSubject = new BehaviorSubject<Theme>(item as Theme);
    this.theme = this.themeSubject.asObservable();
  }

  public readonly THEMES: ThemeOption[] = [
    {
      label: Theme.LIGHT,
      icon: 'brightness_7'
    },
    {
      label: Theme.DARK,
      icon: 'brightness_4'
    }
  ];

  public getTheme(): Theme {
    return this.themeSubject.value;
  }

  public setTheme(theme: Theme): void {
    console.log(theme);
    this.themeSubject.next(theme);
    localStorage.setItem('theme', theme);
  }
}
