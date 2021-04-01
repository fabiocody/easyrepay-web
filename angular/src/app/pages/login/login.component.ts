import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {FormBuilder, Validators} from '@angular/forms';
import {skip} from 'rxjs/operators';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    public loading = false;
    public error: string | null = null;

    public form = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    constructor(
        private userService: UserService,
        private fb: FormBuilder,
    ) {}

    ngOnInit(): void {
        this.userService.user.pipe(skip(1)).subscribe(user => {
            this.loading = false;
            if (user) {
                this.error = null;
            } else {
                this.error = 'ERROR_GENERIC';
            }
        });
    }

    public login(): void {
        this.loading = true;
        this.error = null;
        const usernameField = this.form.get('username');
        const passwordField = this.form.get('password');
        const username = usernameField ? usernameField.value : '';
        const password = passwordField ? passwordField.value : '';
        this.userService.login(username, password);
    }
}
