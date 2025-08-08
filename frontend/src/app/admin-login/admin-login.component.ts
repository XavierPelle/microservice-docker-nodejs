import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminLoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) { }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.adminService.adminLogin(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login admin réussi:', response);

        
        localStorage.setItem('admin_token', response.access_token);
        localStorage.setItem('user_role', 'admin');

        
        this.router.navigate(['/admin-dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur login admin:', error);

        if (error.status === 403) {
          this.errorMessage = 'Accès réservé aux administrateurs';
        } else if (error.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect';
        } else {
          this.errorMessage = 'Erreur de connexion. Veuillez réessayer.';
        }
      }
    });
  }
}
