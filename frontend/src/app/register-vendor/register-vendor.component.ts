import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthentificationService } from '../services/authentification.service';
import { RequestBuilderService } from '../services/request-builder.service';
import { UserSignupDTO } from '../models/user';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-register-vendor',
  standalone: true,
  imports: [FormsModule, CommonModule],
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

  vendorProfile = {
    storeName: '',
    storeDescription: ''
  };

  message: string = '';
  error: string = '';
  private apiUrl: string = environment.API_URL;

  constructor(
    private authentificationService: AuthentificationService,
    private requestBuilder: RequestBuilderService,
    private http: HttpClient,
    private router: Router
  ) {}

  register(): void {
    this.message = '';
    this.error = '';
    this.user.role = 'vendor';
    this.authentificationService.registerWithoutPassword(
      this.user.email,
      this.user.firstName,
      this.user.lastName,
      this.user.role
    ).subscribe({
      next: (response: UserSignupDTO) => {
        if (response && response.salt) {
          this.authentificationService.hashPassword(this.user.password, response.salt).then(hashedPassword => {
            this.authentificationService.sendHashedPassword(this.user.email, hashedPassword).subscribe({
              next: () => {
                this.createVendorProfile();
              },
              error: () => {
                this.error = "Erreur lors de l'envoi du mot de passe haché";
              }
            });
          });
        } else {
          this.error = "Le sel n'a pas été reçu du serveur";
        }
      },
      error: (err) => {
        if (err.status === 400) {
          this.error = "Un utilisateur avec cet email existe déjà. Veuillez utiliser un autre email ou vous connecter.";
        } else if (err.error && err.error.message) {
          this.error = err.error.message;
        } else {
          this.error = "Erreur lors de l'inscription initiale";
        }
      }
    });
  }

  private createVendorProfile(): void {
    setTimeout(() => {
      this.http.get(`${this.apiUrl}/users/${encodeURIComponent(this.user.email)}`).subscribe({
        next: (userData: any) => {
          if (userData && userData.id) {
            const vendorData = {
              userId: userData.id,
              storeName: this.vendorProfile.storeName || `${this.user.firstName} ${this.user.lastName} Store`,
              storeDescription: this.vendorProfile.storeDescription || 'Boutique en ligne'
            };
            this.http.post('http://localhost:5006/vendors', vendorData).subscribe({
              next: () => {
                this.message = "Inscription réussie, veuillez vous connecter.";
                this.resetForm();
              },
              error: () => {
                this.error = "Erreur lors de la création du profil vendeur";
              }
            });
          } else {
            this.error = "Impossible de récupérer l'utilisateur après inscription.";
          }
        },
        error: () => {
          this.error = "Erreur lors de la récupération des données utilisateur";
        }
      });
    }, 500);
  }

  private resetForm(): void {
    this.user = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      salt: '',
      role: ''
    };
    this.vendorProfile = {
      storeName: '',
      storeDescription: ''
    };
  }
} 