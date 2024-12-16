import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart.service';
import { Cart } from '../models/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  productList: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService
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

  addToCart(product: Cart): void {
    this.cartService.addToCard(product).subscribe({
      next: () => {
        console.log('Ajout au panier réussi'+ JSON.stringify(product));
      },
      error: () => {
        console.error('Erreur lors de l\'ajout au panier');
      }
    });
  }
}
