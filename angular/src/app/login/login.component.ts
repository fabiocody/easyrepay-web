import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoginService} from './login.service';
import {FormBuilder, Validators} from '@angular/forms';
import {skip} from 'rxjs/operators';
import {SubSink} from 'subsink';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    public loading = false;
    public error: string | null = null;
    private subs = new SubSink();

    public form = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
    });

    constructor(private loginService: LoginService, private fb: FormBuilder) {}

    ngOnInit(): void {
        this.subs.sink = this.loginService.user.pipe(skip(1)).subscribe(user => {
            this.loading = false;
            if (user) {
                this.error = null;
            } else {
                this.error = 'ERROR_GENERIC';
            }
        });
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public login(): void {
        this.loading = true;
        this.error = null;
        const username = this.form.get('username')!.value;
        const password = this.form.get('password')!.value;
        this.loginService.login(username, password).then();
    }
}
