import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthentificationService } from '../services/authentification.service';
import { UserSignupDTO } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register-vendor.component.html',
  styleUrls: ['./register-vendor.component.scss']
})
export class RegisterVendorComponent {

  user: UserSignupDTO = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    salt: '',
    role: ''
  };

  constructor(
    private authentificationService: AuthentificationService,
    private router: Router
  ) {}

  register(): void {
    (this.user as any).role = 'vendor';
    this.authentificationService.registerWithoutPassword(
      this.user.email,
      this.user.firstName,
      this.user.lastName,
      (this.user as any).role
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
