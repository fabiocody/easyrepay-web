import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NavbarComponent} from './elements/navbar/navbar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatDividerModule} from '@angular/material/divider';
import {LoginComponent} from './pages/login/login.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import {MomentModule} from 'ngx-moment';
import {PeopleListComponent} from './pages/people-list/people-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {PersonCardComponent} from './pages/people-list/person-card/person-card.component';
import {AvatarComponent} from './elements/avatar/avatar.component';
import {AddPersonComponent} from './dialogs/add-person/add-person.component';
import {MatDialogModule} from '@angular/material/dialog';
import {TransactionsListComponent} from './pages/transactions-list/transactions-list.component';
import {RequestInterceptorService} from './services/request-interceptor.service';
import {TransactionCardComponent} from './pages/transactions-list/transaction-card/transaction-card.component';
import {TransactionDialogComponent} from './dialogs/transaction-dialog/transaction-dialog.component';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {DateAdapter, MatNativeDateModule} from '@angular/material/core';
import {TransactionFormComponent} from './elements/transaction-form/transaction-form.component';
import {TransactionFormButtonsComponent} from './elements/transaction-form-buttons/transaction-form-buttons.component';
import {TransactionPageComponent} from './pages/transaction-page/transaction-page.component';
import {TranslationModule} from './utils/translation/translation.module';
import {AppDateAdapter} from './utils/translation/translation.utils';
import {SpinnerModule} from './utils/spinner/spinner.module';
import {SpinnerButtonModule} from './utils/spinner-button/spinner-button.module';
import {InfoDialogModule} from './utils/info-dialog/info-dialog.module';


@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        LoginComponent,
        PeopleListComponent,
        PersonCardComponent,
        AvatarComponent,
        AddPersonComponent,
        TransactionsListComponent,
        TransactionCardComponent,
        TransactionDialogComponent,
        TransactionFormComponent,
        TransactionFormButtonsComponent,
        TransactionPageComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MomentModule,
        TranslationModule,
        SpinnerModule,
        SpinnerButtonModule,
        InfoDialogModule,
        MatButtonModule,
        NgbModule,
        MatToolbarModule,
        MatIconModule,
        MatMenuModule,
        FlexLayoutModule,
        MatDividerModule,
        MatCardModule,
        FormsModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatTooltipModule,
        MatDialogModule,
        MatSelectModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatSlideToggleModule,
        MatNativeDateModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: RequestInterceptorService,
            multi: true
        },
        {
            provide: DateAdapter,
            useClass: AppDateAdapter
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
