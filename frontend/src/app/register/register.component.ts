import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthentificationService } from '../services/authentification.service';
import { UserSignupDTO } from '../DTOs/UserDTO';
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
    password: ''
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
      next: (salt) => {
        this.authentificationService.hashPassword(this.user.password, salt).then(hashedPassword => {
          this.authentificationService.sendHashedPassword(this.user.email, hashedPassword).subscribe({
            next: () => {
              this.router.navigate(["login"]);
            },
            error: (err) => {
              console.error('Erreur lors de l\'envoi du mot de passe haché', err);
            }
          });
        });
      },
      error: (err) => {
        console.error('Erreur lors de l\'inscription initiale', err);
      }
    });
  }
}
