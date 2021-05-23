import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Theme, ThemeOption, ThemeService} from '../../services/theme.service';
import {UserService} from '../../services/user.service';
import {TranslationService} from '../../utils/translation/translation.service';
import {SubSink} from 'subsink';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
    @Input() public title = '';
    public userName = '';
    private subs = new SubSink();

    constructor(
        private translationService: TranslationService,
        private themeService: ThemeService,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        this.subs.sink = this.userService.user.subscribe(user => {
            if (user) {
                this.userName = user.name;
            } else {
                this.userName = '';
            }
        });
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public setLanguage(lang: string): void {
        this.translationService.use(lang).then();
    }

    public getThemes(): ThemeOption[] {
        return this.themeService.THEMES;
    }

    public setTheme(theme: Theme): void {
        this.themeService.setTheme(theme);
    }

    public logout(): void {
        this.userService.logout();
    }
}
