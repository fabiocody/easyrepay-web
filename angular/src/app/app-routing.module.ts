import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';

const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'people', loadChildren: () => import('./people/people.module').then(m => m.PeopleModule)},
    {path: 'transactions', loadChildren: () => import('./transactions/transactions.module').then(m => m.TransactionsModule)},
    // {path: 'people/:id', component: TransactionsComponent},
    // {path: 'transaction', component: TransactionPageComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
