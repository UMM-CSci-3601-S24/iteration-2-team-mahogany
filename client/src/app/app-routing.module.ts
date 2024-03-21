import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddUserComponent } from './users/add-user.component';
import { UserListComponent } from './users/user-list.component';
import { UserProfileComponent } from './users/user-profile.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { HostProfileComponent } from './hosts/host-profile.component';
import { HuntProfileComponent } from './hunts/hunt-profile.component';
import { HuntCardComponent } from './hunts/hunt-card.component';
import { AddHuntComponent } from './hunts/addHunt/add-hunt.component';
import { HuntEditComponent } from './hunts/hunt-edit/hunt-edit.component';
import { TaskEditComponent } from './hunts/task-edit/task-edit.component';


// Note that the 'users/new' route needs to come before 'users/:id'.
// If 'users/:id' came first, it would accidentally catch requests to
// 'users/new'; the router would just think that the string 'new' is a user ID.
const routes: Routes = [
  {path: '', component: HomeComponent, title: 'Home'},
  {path: 'users', component: UserListComponent, title: 'Users'},
  {path: 'users/new', component: AddUserComponent, title: 'Add User'},
  {path: 'users/:id', component: UserProfileComponent, title: 'User Profile'},
  {path: 'companies', component: CompanyListComponent, title: 'Companies'},
  {path: 'hosts', component: HostProfileComponent, title: 'Host Profile'},
  {path: 'hunts/new', component: AddHuntComponent, title: 'Add Hunt'},
  {path: 'hunts/:id', component: HuntProfileComponent, title: 'Hunts Profile'},
  {path: 'hunts', component: HuntCardComponent, title: 'Hunts'},
  {path: 'hunts/:id/edit', component: HuntEditComponent, title: 'Edit Hunt'},
  {path: 'tasks/:id/edit', component: TaskEditComponent, title: 'Edit Task'},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
