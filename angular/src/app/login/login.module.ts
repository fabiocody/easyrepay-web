import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LoginRoutingModule} from './login-routing.module';
import {LoginComponent} from './login.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {TranslationModule} from '../utils/translation/translation.module';
import {MatInputModule} from '@angular/material/input';
import {SpinnerButtonModule} from '../utils/spinner-button/spinner-button.module';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
    declarations: [LoginComponent],
    imports: [
        CommonModule,
        LoginRoutingModule,
        TranslationModule,
        SpinnerButtonModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule
    ]
})
export class LoginModule {
}
