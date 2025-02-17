import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';
import { AuthGuard } from './services/auth-guard.service';
import { ProductComponent } from './product/product.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'cart', component: CartComponent, canActivate: [AuthGuard]},
    { path: 'product', component: ProductComponent, canActivate: [AuthGuard]},
];
