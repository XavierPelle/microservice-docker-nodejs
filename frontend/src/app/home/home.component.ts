import { Component } from '@angular/core';
import { ProductComponent } from '../product/product.component';

@Component({
  selector: 'app-home',
  imports: [ProductComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
