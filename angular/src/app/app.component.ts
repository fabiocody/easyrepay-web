import {Component, OnDestroy} from '@angular/core';
import {UserService} from './services/user.service';
import {Router} from '@angular/router';
import {SubSink} from 'subsink';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy{
    public title = 'EasyRepay';
    public loading = false;
    private subs = new SubSink();

    constructor(
        private router: Router,
        private userService: UserService,
    ) {
        this.subs.sink = this.userService.user.subscribe(user => {
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
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
