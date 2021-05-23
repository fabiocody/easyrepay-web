import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export enum Theme {
    LIGHT = 'LIGHT',
    DARK = 'DARK',
}

export interface ThemeOption {
    label: Theme;
    icon: string;
}

@Injectable()
export class ThemeService {
    private themeSubject: BehaviorSubject<Theme>;
    public theme: Observable<Theme>;

    constructor() {
        const item = localStorage.getItem('theme') || Theme.LIGHT;
        this.themeSubject = new BehaviorSubject<Theme>(item as Theme);
        this.theme = this.themeSubject.asObservable();
        this.setTheme(item as Theme);
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

    public setTheme(theme: Theme): void {
        this.themeSubject.next(theme);
        localStorage.setItem('theme', theme);
        const body = document.getElementsByClassName('main-body')[0] as HTMLElement;
        switch (theme) {
            case Theme.LIGHT:
                body.classList.remove('easyrepay-dark-theme');
                break;
            case Theme.DARK:
                body.classList.add('easyrepay-dark-theme');
        }
    }
}
