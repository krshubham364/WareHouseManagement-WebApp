import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BrandService } from '../../services/brand.service';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  totalOrders!: number;
  totalProducts!: number;
  totalBrands!: number;

  brandService=inject(BrandService);
  orderService=inject(OrderService);
  productService=inject(ProductService);

  constructor() {} // Correct way to inject

  ngOnInit() {
    this.brandService.getBrands().subscribe((result) => (this.totalBrands = result.length));


    this.orderService.getOrders().subscribe((result:any) => (this.totalOrders = result.length));

    // this.orderService.getOrders().subscribe((result) => {
    //   if (result && Array.isArray(result)) {  // ✅ Ensure it's an array
    //     this.totalOrders = result.length;
    //   } else {
    //     this.totalOrders = 0;
    //   }
    // });


    this.productService.getProducts().subscribe((result) => (this.totalProducts = result.length))
    
  }    
}
