import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthentificationService } from '../services/authentification.service';
import { UserSignupDTO } from '../DTOs/UserDTO';
import * as bcrypt from "bcryptjs";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  
  constructor(private authentificationService: AuthentificationService, private router: Router) {}

  user: UserSignupDTO = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  register() {
    this.authentificationService.register(this.user.email, this.user.firstName, this.user.lastName).subscribe({
      next: async (response) => {
        //console.log(this.user.password, response.salt);
        const hashedPassword = await bcrypt.hash(this.user.password, 64);
        console.log(hashedPassword);
        this.router.navigate(["login"]);
      },
      error: (err) => {
        console.error('Erreur lors de l\'inscription', err);
      }
    });
  }
}
