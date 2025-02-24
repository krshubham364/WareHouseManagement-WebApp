// order-form.component.ts
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ProductService } from '../../../services/product.service';
import Product from '../../../types/product';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import Order from '../../../types/order';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule,
  ],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss',
})
export class OrderFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  toaster=inject(ToastrService);

  orderForm: FormGroup = this.formBuilder.group({
    orderNo: ['', Validators.required],
    productId: ['', Validators.required],
    quantity: [null, [Validators.required, Validators.min(1)]],
    salePrice: [{ value: null, disabled: true }],
    discount: [0],
    totalAmount: [{ value: null, disabled: true }],
  });

  products: Product[] = [];
  selectedProduct?: Product;
  order!: Order;
  isEditMode: boolean = false;

  ngOnInit() {
    const id = this.route.snapshot.params['id'];

    if (id) {
      this.isEditMode = true;
      this.orderService.getOrder(id).subscribe((result) => {
        this.order = result;
        this.orderForm.patchValue(this.order);

        this.productService.getProducts().subscribe((products) => {
          this.products = products;
          this.selectedProduct = this.products.find(
            (product) => product.id === this.order.productId
          );

          if (this.selectedProduct) {
            this.orderForm.get('salePrice')?.setValue(this.selectedProduct.salePrice);
          }

          this.orderForm.get('productId')?.disable();
        });
      });
    } else {
      this.isEditMode = false;
      this.productService.getProducts().subscribe((result) => {
        this.products = result;
      });
    }

    // Auto update total amount on change
    this.orderForm.valueChanges.subscribe(() => {
      this.updateTotalAmount();
    });
  }

  addOrder() {
    if (this.orderForm.invalid) {
      this.toaster.error('Please fill out all required fields');
      return;
    }

    const formValue = this.orderForm.getRawValue();

    if (formValue.quantity! > this.selectedProduct!.availableQuantity) {
      this.toaster.warning(
        `We have only ${this.selectedProduct!.availableQuantity} units available in inventory`
      );
      return;
    }

    this.orderService.addOrder(formValue).subscribe({
      next: () => {
        this.selectedProduct!.availableQuantity -= formValue.quantity!;
        this.productService
          .updateProduct(this.selectedProduct!.id!, this.selectedProduct!)
          .subscribe(() => {
            this.toaster.success('Your order has been added successfully');
            this.router.navigate(['/orders']);
          });
      },
      error: (error) => {
        console.error('Failed to add order:', error);
        alert('Failed to add order. Please try again.');
      },
    });
  }

  updateOrder() {
    if (this.orderForm.invalid) {
      this.toaster.error('Please fill out all required fields');
      return;
    }
  
    const formValue = this.orderForm.getRawValue();
  
    if (
      formValue.quantity! >
      this.selectedProduct!.availableQuantity + this.order.quantity!
    ) {
      this.toaster.warning(
        `We have only ${this.selectedProduct!.availableQuantity} units available in inventory`
      );
      return;
    }
  
    // Call updateOrder with the correct arguments
    this.orderService.updateOrder(this.order.id!, formValue).subscribe({
      next: () => {
        this.selectedProduct!.availableQuantity -=
          formValue.quantity! - this.order.quantity!;
  
        this.productService
          .updateProduct(this.selectedProduct!.id!, this.selectedProduct!)
          .subscribe(() => {
            this.toaster.success('Your order has been updated successfully');
            this.router.navigate(['/orders']);
          });
      },
      error: (error) => {
        console.error('Failed to update order:', error);
        alert('Failed to update order. Please try again.');
      },
    });
  }
  updateTotalAmount() {
    const { productId, quantity, discount } = this.orderForm.value;

    if (productId && quantity) {
      this.selectedProduct = this.products.find(
        (product) => product.id === productId
      );
      if (this.selectedProduct) {
        const total =
          this.selectedProduct.salePrice * quantity - (discount || 0);
        this.orderForm.get('totalAmount')?.enable({ emitEvent: false });
        this.orderForm
          .get('totalAmount')
          ?.setValue(total, { emitEvent: false });
        this.orderForm.get('totalAmount')?.disable({ emitEvent: false });
      }
    }
  }

  productSelected(productId: string) {
    this.selectedProduct = this.products.find(
      (product) => product.id === productId
    );
    if (this.selectedProduct) {
      this.orderForm.get('salePrice')?.setValue(this.selectedProduct.salePrice);
    }
  }
}