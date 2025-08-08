import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestBuilderService } from '../services/request-builder.service';
import { Product } from '../models/product';
import { CommonModule } from '@angular/common';
import { AuthentificationService } from '../services/authentification.service';
import { CartService } from '../services/cart.service';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {

  imagesrc = 'images/default.jpg';
  product: Product | null = null;
  constructor(
    private route: ActivatedRoute,
    private requestBuilderService: RequestBuilderService,
    private authService: AuthentificationService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.requestBuilderService.execute('get', `/vendors/product/${id}`, null, true).subscribe({
      next: (data: Product) => {
        this.product = data;
      },
      error: () => {
        console.error('Erreur lors du chargement des produits');
      },
    });
  }
  getImageUrl(imagePath?: string | null): string {
    if (!imagePath) {
      return 'assets/images/default.jpg';
    }
    return `http://localhost:5006${imagePath}`;
  }

addToCart(product: Product): void {
  const userInfo = this.authService.getUserInfo();
  const newCartItem = { ...product, user_id: userInfo.user_id, quantity: product.quantity || 1 };
  console.log(newCartItem)
  this.requestBuilderService.execute('post', '/cart/create', newCartItem).subscribe({
    next: () => {
      this.cartService.addItem(newCartItem);
    },
    error: () => {
      console.error('Erreur lors de l\'ajout au panier.');
    }
  });
}
}

