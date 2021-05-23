import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {TransactionsListComponent} from './pages/transactions-list/transactions-list.component';
import {TransactionPageComponent} from './pages/transaction-page/transaction-page.component';

const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'people', loadChildren: () => import('./people/people.module').then(m => m.PeopleModule)},
    {path: 'people/:id', component: TransactionsListComponent},
    {path: 'transaction', component: TransactionPageComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
