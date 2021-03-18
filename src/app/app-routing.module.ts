import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {PeopleListComponent} from './pages/people-list/people-list.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'people', component: PeopleListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
