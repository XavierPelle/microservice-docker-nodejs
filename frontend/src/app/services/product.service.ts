import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:5000';

  getProduct(): Observable<Product[]> {
		return this.http.get<Product[]>(`${this.apiUrl}/product`);
	}

}
