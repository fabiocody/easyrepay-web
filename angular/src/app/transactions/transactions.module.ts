import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TransactionsRoutingModule} from './transactions-routing.module';
import {TransactionsComponent} from './transactions.component';
import {TransactionCardComponent} from './transaction-card/transaction-card.component';
import {TranslationModule} from '../utils/translation/translation.module';
import {SpinnerModule} from '../utils/spinner/spinner.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MomentModule} from 'ngx-moment';
import {TransactionsService} from './transactions.service';
import {TransactionDialogComponent} from './transaction-dialog/transaction-dialog.component';
import {TransactionFormComponent} from './transaction-form/transaction-form.component';
import {TransactionFormButtonsComponent} from './transaction-form-buttons/transaction-form-buttons.component';
import {TransactionPageComponent} from './transaction-page/transaction-page.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {SpinnerButtonModule} from '../utils/spinner-button/spinner-button.module';
import {PeopleModule} from '../people/people.module';
import {InfoDialogModule} from '../utils/info-dialog/info-dialog.module';


@NgModule({
    declarations: [
        TransactionsComponent,
        TransactionCardComponent,
        TransactionFormComponent,
        TransactionFormButtonsComponent,
        TransactionDialogComponent,
        TransactionPageComponent
    ],
    imports: [
        CommonModule,
        TransactionsRoutingModule,
        TranslationModule,
        InfoDialogModule,
        PeopleModule,
        SpinnerModule,
        SpinnerButtonModule,
        FlexLayoutModule,
        FormsModule,
        MomentModule,
        MatButtonModule,
        MatIconModule,
        MatSlideToggleModule,
        MatMenuModule,
        MatDividerModule,
        MatCardModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatDatepickerModule,
        MatCheckboxModule,
    ],
    providers: [TransactionsService]
})
export class TransactionsModule {
}
