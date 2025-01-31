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
    this.requestBuilderService.execute('get', `/product/${id}`).subscribe({
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
    const productWithUserId = { ...product, user_id: userInfo.user_id, quantity: 1 };
    this.requestBuilderService.execute('post', '/cart/create', productWithUserId).subscribe({
      next: () => {
        console.log('Ajout au panier réussi', productWithUserId);
      },
      error: () => {
        console.error('Erreur lors de l\'ajout au panier');
      }
    });
  }
}

