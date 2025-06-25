import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {

  constructor(private authentificationService: AuthentificationService, private router: Router) { }

  user: UserSigninDTO = {
    email: '',
    password: '',
    salt: '',
    role: '',
    access_token: ''
  };


  ngOnInit(): void {
    const userInfo = this.authentificationService.getUserInfo();
    console.log(userInfo)
    if (userInfo) {
      this.router.navigate(['/']);
    }
  }

  login() {
    this.authentificationService.login(this.user.email).subscribe({
      next: (response: UserSigninDTO) => {
        if (response && response.salt) {
          this.authentificationService.hashPassword(this.user.password, response.salt).then(hashedPassword => {
            this.authentificationService.loginWithPassword(this.user.email, hashedPassword).subscribe({
              next: (loginResponse) => {
                localStorage.setItem('access_token', loginResponse.access_token);
                this.router.navigate(['/']);
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
