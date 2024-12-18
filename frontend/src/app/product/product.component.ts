import { Component } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { Cart } from '../models/cart';
import { CommonModule } from '@angular/common';
import { AuthentificationService } from '../services/authentification.service';
import { switchMap } from 'rxjs';
import { Token } from '../models/token'

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {

  productList: Product[] = [];
  userInfo: string = '';
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthentificationService
  ) {}

  ngOnInit(): void {
    this.productService.getProduct().subscribe({
      next: data => {
        this.productList = data.map(product => ({...product, quantity: 1}));
      },
      error: () => {
        console.error('Erreur lors du chargement des produits');
      },
    });
  }

  increaseQuantity(cart: Cart): void {
    cart.quantity = (cart.quantity || 1) + 1;
  }

  decreaseQuantity(cart: Cart): void {
    if (cart.quantity && cart.quantity > 1) {
      cart.quantity--;
    }
  }

  addToCart(product: Product): void {
    const token = this.authService.getToken();
    const decodedToken = this.authService.decodeToken(token)
    const userId = decodedToken.id;
    const productWithUserId = { ...product, user_id: userId };
    this.cartService.addToCart(productWithUserId).subscribe({
      next: () => {
        console.log('Ajout au panier réussi', productWithUserId);
      },
      error: () => {
        console.error('Erreur lors de l\'ajout au panier');
      }
    });
  }
}
