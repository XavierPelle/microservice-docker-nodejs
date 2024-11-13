import { Component } from '@angular/core';
import { UserSigninDTO } from '../DTOs/UserDTO';
import { AuthentificationService } from '../services/authentification.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  constructor(private authentificationService: AuthentificationService) {}

  user: UserSigninDTO = {
    email: '',
    password: ''
  };

  login() {
    this.authentificationService.login(this.user).subscribe({
      next: (data: UserSigninDTO) => {
        console.log('Connexion réussie', data);
      },
      error: (err) => {
        console.error('Erreur lors de la connexion', err);
      }
    });
  }
}
