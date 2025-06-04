import { Component } from '@angular/core';
import { UserSigninDTO } from '../models/user';
import { AuthentificationService } from '../services/authentification.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  constructor(private authentificationService: AuthentificationService, private router: Router) {}

  user: UserSigninDTO = {
    email: '',
    password: '',
    salt: '',
    access_token: ''
  };

  login() {
    this.authentificationService.login(this.user.email).subscribe({
      next: (response: UserSigninDTO) => {
        if (response && response.salt) {
          this.authentificationService.hashPassword(this.user.password, response.salt).then(hashedPassword => {
            this.authentificationService.loginWithPassword(this.user.email, hashedPassword).subscribe({
              next: (loginResponse) => {
                localStorage.setItem('access_token', loginResponse.access_token);
                this.router.navigate(['/cart']);
              },
              error: (loginError) => {
                console.error('Erreur lors de la connexion avec le mot de passe haché', loginError);
              }
            });
          });
        } else {
          console.error('L\'email et le mot de passe ne corresponds pas');
        }
      },
      error: (err) => {
        console.error('Email incorrect', err);
      }
    });
  }
}
