import {Component, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from './login/login.service';
import {SubSink} from 'subsink';
import {ReleaseInfoService} from './utils/release-info/release-info.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
    public title = 'EasyRepay';
    public loading = false;
    private subs = new SubSink();

    constructor(
        private router: Router,
        private loginService: LoginService,
        private releaseInfoService: ReleaseInfoService,
    ) {
        this.subs.sink = this.loginService.user.subscribe(user => {
            if (user) {
                if (this.loading) {
                    this.router.navigate(['/people']).then();
                }
                this.loading = false;
            } else if (user === null) {
                this.router.navigate(['/login']).then();
                this.loading = false;
            } else {
                this.loading = true;
            }
        });
        this.releaseInfoService.getReleaseInfo().then(releaseInfo => console.log('Release', releaseInfo));
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
