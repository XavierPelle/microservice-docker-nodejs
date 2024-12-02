import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthentificationService } from '../services/authentification.service';
import { UserSignupDTO } from '../DTOs/UserDTO';
import * as bcrypt from "bcryptjs";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  
  constructor(private authentificationService: AuthentificationService) {}

  user: UserSignupDTO = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    salt:''
  };

  register() {
    this.authentificationService.register(this.user.email, this.user.firstName, this.user.lastName).subscribe({
      next: async (response) => {
        console.log(this.user.password, response.salt);
        const hashedPassword = await bcrypt.hash(this.user.password, 10/*JSON.stringify(response.salt)*/); // L'auth service renvoie le salt en fonction du 
        console.log(hashedPassword);
        /*
        this.authentificationService.sendHashedPassword(response.email, hashedPassword).subscribe({
          next: (response) => {
            console.log('Mot de passe hashé envoyé avec succès', response);
          },
          error: (err) => {
            console.error('Erreur lors de l\'envoi du mot de passe hashé', err);
          }
        });
        */
      },
      error: (err) => {
        console.error('Erreur lors de l\'inscription', err);
      }
    });
  }
}
