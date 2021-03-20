import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {PeopleListComponent} from './pages/people-list/people-list.component';
import {TransactionsListComponent} from './pages/transactions-list/transactions-list.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'people', component: PeopleListComponent},
  {path: 'transactions/:id', component: TransactionsListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
