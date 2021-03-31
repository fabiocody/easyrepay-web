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
    public loading = false;

    constructor(
        private router: Router,
        private userService: UserService,
    ) {
        this.userService.user.subscribe(user => {
            if (user) {
                this.router.navigate(['/people']);
                this.loading = false;
            } else if (user === null) {
                this.router.navigate(['/login']);
                this.loading = false;
            } else {
                this.loading = true;
            }
        });
    }
}
