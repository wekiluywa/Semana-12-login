import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';         // Ajusta a './pages/login/login.component' si aplica
import { FansiteComponent } from './pages/fansite/fansite';   // Ajusta a './pages/fansite/fansite.component' si aplica
import { authGuard } from './guards/auth-guard';              // Ajusta a './guards/auth.guard' si aplica

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'fansite', component: FansiteComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];