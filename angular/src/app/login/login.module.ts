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
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
    declarations: [LoginComponent],
    imports: [
        CommonModule,
        LoginRoutingModule,
        TranslationModule,
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
    ],
})
export class LoginModule {}
