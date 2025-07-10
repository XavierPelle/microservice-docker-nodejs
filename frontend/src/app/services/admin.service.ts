import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestBuilderService } from './request-builder.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl: string = environment.API_URL;

  constructor(
    private requestBuilder: RequestBuilderService,
    private http: HttpClient
  ) { }

  // ===== LOGIN ADMIN =====
  adminLogin(email: string, password: string): Observable<any> {
    // Utiliser HttpClient directement pour le login (pas de vérification d'auth)
    return this.http.post(`${this.baseUrl}/admin/login`, { email, password });
  }

  // ===== DASHBOARD =====
  getDashboardStats(): Observable<any> {
    return this.requestBuilder.execute('get', '/admin/dashboard/stats', null, true);
  }

  // ===== GESTION DES ADMINS =====
  getAllAdmins(): Observable<any[]> {
    return this.requestBuilder.execute('get', '/admin/admins', null, true);
  }

  getAdminById(id: number): Observable<any> {
    return this.requestBuilder.execute('get', `/admin/admins/${id}`, null, true);
  }

  createAdmin(userId: number): Observable<any> {
    return this.requestBuilder.execute('post', '/admin/admins', { userId }, true);
  }

  updateAdmin(id: number, adminData: any): Observable<any> {
    return this.requestBuilder.execute('put', `/admin/admins/${id}`, adminData, true);
  }

  deleteAdmin(id: number): Observable<any> {
    return this.requestBuilder.execute('delete', `/admin/admins/${id}`, null, true);
  }

  getAdminByUserId(userId: number): Observable<any> {
    return this.requestBuilder.execute('get', `/admin/admins/user/${userId}`, null, true);
  }

  // ===== GESTION DES VENDEURS =====
  getAllVendors(): Observable<any[]> {
    return this.requestBuilder.execute('get', '/admin/vendors', null, true);
  }

  createVendor(vendorData: any): Observable<any> {
    return this.requestBuilder.execute('post', '/admin/vendors', vendorData, true);
  }

  approveVendor(vendorId: number): Observable<any> {
    return this.requestBuilder.execute('put', `/admin/vendors/${vendorId}`, { status: 'approved' }, true);
  }

  rejectVendor(vendorId: number): Observable<any> {
    return this.requestBuilder.execute('put', `/admin/vendors/${vendorId}`, { status: 'rejected' }, true);
  }

  updateVendorStatus(vendorId: number, status: string): Observable<any> {
    return this.requestBuilder.execute('put', `/admin/vendors/${vendorId}`, { status }, true);
  }

  deleteVendor(vendorId: number): Observable<any> {
    return this.requestBuilder.execute('delete', `/admin/vendors/${vendorId}`, null, true);
  }

  // ===== GESTION DES UTILISATEURS =====
  getAllUsers(): Observable<any[]> {
    return this.requestBuilder.execute('get', '/admin/users', null, true);
  }

  updateUser(userId: number, userData: any): Observable<any> {
    return this.requestBuilder.execute('put', `/admin/users/${userId}`, userData, true);
  }

  deleteUser(userId: number): Observable<any> {
    return this.requestBuilder.execute('delete', `/admin/users/${userId}`, null, true);
  }

  createUser(userData: any) {
    return this.requestBuilder.execute('post', '/admin/users', userData, true);
  }

  // ===== GESTION DES PRODUITS =====
  getAllProducts(): Observable<any[]> {
    return this.requestBuilder.execute('get', '/admin/products', null, true);
  }

  createProduct(productData: any): Observable<any> {
    return this.requestBuilder.execute('post', '/admin/products', productData, true);
  }

  updateProduct(productId: number, productData: any): Observable<any> {
    return this.requestBuilder.execute('put', `/admin/products/${productId}`, productData, true);
  }

  deleteProduct(productId: number): Observable<any> {
    return this.requestBuilder.execute('delete', `/admin/products/${productId}`, null, true);
  }

  approveProduct(productId: number): Observable<any> {
    return this.requestBuilder.execute('put', `/admin/products/${productId}`, { status: 'approved' }, true);
  }

  rejectProduct(productId: number): Observable<any> {
    return this.requestBuilder.execute('put', `/admin/products/${productId}`, { status: 'rejected' }, true);
  }
}
