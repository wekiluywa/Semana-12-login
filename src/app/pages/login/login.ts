import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html', // Cambia a './login.component.html' si tu archivo se llama así
  styleUrl: './login.css'     // Cambia a './login.component.css' si tu archivo se llama así
})
export class LoginComponent {
  authService = inject(AuthService);
}