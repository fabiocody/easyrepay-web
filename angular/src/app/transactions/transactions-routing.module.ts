import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TransactionsComponent} from './transactions.component';
import {TransactionPageComponent} from './transaction-page/transaction-page.component';

const routes: Routes = [
    {path: '', component: TransactionsComponent},
    {path: 'transaction', component: TransactionPageComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TransactionsRoutingModule {
}
