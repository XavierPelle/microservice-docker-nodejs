import { Component } from '@angular/core';
import { Product } from '../models/product';
import { CommonModule } from '@angular/common';
import { AuthentificationService } from '../services/authentification.service';
import { MatCardModule } from '@angular/material/card';
import { RequestBuilderService } from '../services/request-builder.service';
import { Router } from '@angular/router';

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
  imagesrc = 'images/category-thumb-1.jpg';
  errorMsg: string = '';

  constructor(
    private authService: AuthentificationService,
    private requestBuilderService: RequestBuilderService,
    private router: Router,
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

    // Créer un objet cart avec seulement les champs nécessaires
    const cartItem = {
      name: product.name,
      productReference: product.productReference,
      price: product.price,
      quantity: product.quantity || 1,
      user_id: userInfo.user_id
    };

    this.requestBuilderService.execute('post', '/cart/create', cartItem).subscribe({
      next: () => {
        console.log('Ajout au panier réussi', cartItem);
        // Optionnel : afficher un message de succès à l'utilisateur
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout au panier', error);
        // Optionnel : afficher un message d'erreur à l'utilisateur
      }
    });
  }
  onCardClick(product: Product): void {
    this.router.navigate([`/product/${product.id}`]);
  }
}
