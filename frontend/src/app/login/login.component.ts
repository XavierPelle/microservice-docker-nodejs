import { Component } from '@angular/core';
import { UserSigninDTO } from '../models/user';
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
    password: '',
    salt: '',
  };

  login() {
    this.authentificationService.login(this.user.email).subscribe({
      next: (response: UserSigninDTO) => {
        if (response && response.salt) {
          this.authentificationService.hashPassword(this.user.password, response.salt).then(hashedPassword => {
            this.authentificationService.loginWithPassword(this.user.email, hashedPassword).subscribe({
              next: (loginResponse) => {
                console.log('Connexion réussie', loginResponse);
              },
              error: (loginError) => {
                console.error('Erreur lors de la connexion avec le mot de passe haché', loginError);
              }
            });
          });
        } else {
          console.error('Le sel n\'a pas été reçu du serveur');
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du sel', err);
      }
    });
  }
  
}
