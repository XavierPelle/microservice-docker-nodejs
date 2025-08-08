import { Component } from '@angular/core';
import { AuthentificationService } from '../../services/authentification.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { RequestBuilderService } from '../../services/request-builder.service';
import { Cart } from '../../models/cart';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  public authStateSubscription: Subscription;
  cart: Cart[] = [];
  cartSubscription: Subscription | undefined;

  constructor(private authService: AuthentificationService, private router: Router, private requestBuilderService: RequestBuilderService, private cartService: CartService) {
    this.authStateSubscription = this.authService.authState$.subscribe((authState: boolean) => {
      console.log('L\'état de l\'authentification a changé :', authState);
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  ngOnInit(): void {
    const userInfo = this.authService.getUserInfo();

    this.requestBuilderService.execute('get', `/cart/find/${userInfo.user_id}`, null, false).subscribe({
      next: (data: Cart[]) => {
        this.cartService.setCartItems(data);
      },
      error: () => {
        console.error('Erreur lors du chargement du panier');
      },
    });

    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cart = items;
    });

    this.authStateSubscription = this.authService.authState$.subscribe(auth => {
      console.log('Auth state changed :', auth);
    });
  }

  getTotalPrice(): number {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  ngOnDestroy() {
    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }
    this.cartSubscription?.unsubscribe();
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
}
