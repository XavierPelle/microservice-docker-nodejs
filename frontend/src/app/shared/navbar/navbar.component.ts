import { Component } from '@angular/core';
import { AuthentificationService } from '../../services/authentification.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(private authService: AuthentificationService, private router: Router) {}
  
  isLoggedIn() {
    return this.authService.getAuthState()
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });;
  }
}
