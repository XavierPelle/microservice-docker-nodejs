import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    const adminToken = localStorage.getItem('admin_token');
    const userRole = localStorage.getItem('user_role');

    if (adminToken && userRole === 'admin') {
      return true;
    }

    // Rediriger vers la page de login admin si pas connecté
    this.router.navigate(['/admin-login']);
    return false;
  }
}
