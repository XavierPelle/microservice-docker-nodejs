import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthentificationService } from '../services/authentification.service';
import { UserSignupDTO } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  user: UserSignupDTO = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    salt: ''
  };

  constructor(
    private authentificationService: AuthentificationService,
    private router: Router
  ) {}

  register(): void {
    this.authentificationService.registerWithoutPassword(
      this.user.email,
      this.user.firstName,
      this.user.lastName
    ).subscribe({
      next: (response: UserSignupDTO) => {
        if (response && response.salt) {
          this.authentificationService.hashPassword(this.user.password, response.salt).then(hashedPassword => {
            this.authentificationService.sendHashedPassword(this.user.email, hashedPassword).subscribe({
              next: (registerResponse) => {
                console.log('Inscription réussie', registerResponse);
                this.router.navigate(["login"]);
              },
              error: (registerError) => {
                console.error('Erreur lors de l\'envoi du mot de passe haché', registerError);
              }
            });
          });
        } else {
          console.error('Le sel n\'a pas été reçu du serveur');
        }
      },
      error: (err) => {
        console.error('Erreur lors de l\'inscription initiale', err);
      }
    });
  }
}
