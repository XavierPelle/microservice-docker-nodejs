import { Component } from '@angular/core';
import { Product } from '../models/product';
import { CommonModule } from '@angular/common';
import { AuthentificationService } from '../services/authentification.service';
import { MatCardModule } from '@angular/material/card';
import { RequestBuilderService } from '../services/request-builder.service';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {

  productList: Product[] = [];
  userInfo: string = '';
  errorMsg: string = '';

  constructor(
    private authService: AuthentificationService,
    private requestBuilderService: RequestBuilderService,
    private router: Router,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.requestBuilderService.execute('get', '/vendors/products', null, true).subscribe({
      next: data => {
        this.productList = data.map((product: any) => ({ ...product, quantity: 1 }));
        this.errorMsg = '';
      },
      error: (err) => {
        this.errorMsg = 'Erreur lors du chargement des produits : ' + (err?.message || '');
        console.error('Erreur lors du chargement des produits', err);
      },
    });
  }

  increaseQuantity(cart: Product): void {
    cart.quantity = (cart.quantity || 1) + 1;
  }

  decreaseQuantity(cart: Product): void {
    if (cart.quantity && cart.quantity > 1) {
      cart.quantity--;
    }
  }

  addToCart(product: Product): void {
    const userInfo = this.authService.getUserInfo();
    const newCartItem = { ...product, user_id: userInfo.user_id, quantity: product.quantity || 1 };
  
    this.requestBuilderService.execute('post', '/cart/create', newCartItem).subscribe({
      next: () => {
        console.log('Produit ajouté au panier');
        this.cartService.addItem(newCartItem);
      },
      error: () => {
        console.error('Erreur lors de l\'ajout au panier.');
      }
    });
  }
  onCardClick(product: Product): void {
    this.router.navigate([`/product/${product.id}`]);
  }
}
