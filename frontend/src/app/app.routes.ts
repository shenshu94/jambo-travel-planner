import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page.component';
import { PlannerPageComponent } from './pages/planner-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginPageComponent },
  { path: 'planner', component: PlannerPageComponent }
];
