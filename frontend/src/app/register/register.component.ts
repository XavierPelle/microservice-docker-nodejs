import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthentificationService } from '../services/authentification.service';
import { UserSignupDTO } from '../DTOs/UserDTO';

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
    password: ''
  };

  register() {
    this.authentificationService.register(this.user).subscribe({
      next: (data: UserSignupDTO) => {
        console.log('Inscription réussie', data);
      },
      error: (err) => {
        console.error('Erreur lors de l\'inscription', err);
      }
    });
  }
}
