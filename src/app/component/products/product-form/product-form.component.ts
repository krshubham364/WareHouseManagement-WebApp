import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrandService } from '../../../services/brand.service';
import Brand from '../../../types/brand';
import { ProductService } from '../../../services/product.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import Product from '../../../types/product';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    RouterLink,
    RouterModule,
    CommonModule, // ✅ Keep CommonModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  builder = inject(FormBuilder);
  brandService = inject(BrandService);
  productService = inject(ProductService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  brands: Brand[] = [];
  product!: Product;

  productForm: FormGroup = this.builder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    details: ['', [Validators.minLength(5)]],
    brandId: ['', Validators.required],
    purchasePrice: ['', [Validators.required, Validators.min(1)]],
    salePrice: ['', [Validators.required, Validators.min(1)]],
    availableQuantity: ['', [Validators.required, Validators.min(0)]],
  });

  ngOnInit() {
    let id = this.route.snapshot.params['id'];
    this.brandService.getBrands().subscribe((result) => (this.brands = result));

    if (id) {
      this.productService.getProduct(id).subscribe((result) => {
        if (result) {
          this.product = result;
          this.productForm.patchValue(this.product);
        }
      });
    }
}

  addProduct() {
    if (this.productForm.invalid) {
      alert('Please provide all the details');
      return;
    }
    let product: Product = this.productForm.value;
    this.productService.addProduct(product).subscribe(() => {
      alert('Product added successfully');
      this.router.navigate(['/products']);
    });
  }

  updateProduct() {
    if (this.productForm.invalid) {
      alert('Please provide all the details');
      return;
    }
    let product: Product = this.productForm.value;
    this.productService.updateProduct(this.product.id!, product).subscribe((result) => {
      alert('Product updated successfully');
      this.router.navigate(['/products']);
    });
  }
}
