import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestBuilderService } from '../services/request-builder.service';
import { Product } from '../models/product';
import { CommonModule } from '@angular/common';
import { AuthentificationService } from '../services/authentification.service';

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
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.requestBuilderService.execute('get', `/product/${id}`, null, true).subscribe({
      next: (data: Product) => {
        this.product = data;
      },
      error: () => {
        console.error('Erreur lors du chargement des produits');
      },
    });
  }

  addToCart(product: Product): void {
    const userInfo = this.authService.getUserInfo();

    // Créer un objet cart avec seulement les champs nécessaires
    const cartItem = {
      name: product.name,
      productReference: product.productReference,
      price: product.price,
      quantity: 1,
      user_id: userInfo.user_id
    };

    this.requestBuilderService.execute('post', '/cart/create', cartItem).subscribe({
      next: () => {
        console.log('Ajout au panier réussi', cartItem);
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout au panier', error);
      }
    });
  }
}

