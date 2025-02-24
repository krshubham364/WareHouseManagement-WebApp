import { Component, inject, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import Order from '../../types/order';
import { OrderService } from '../../services/order.service';
import Product from '../../types/product';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    RouterLink,
    MatSortModule,
    MatInputModule,
    CommonModule,
    MatFormFieldModule,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<Order>(); // ✅ Initialize dataSource
  orderService = inject(OrderService);
  productsService = inject(ProductService);
  toaster = inject(ToastrService);
  products: Product[] = [];
  orders: Order[] = [];

  displayedColumns = [
    'orderNo',
    'productId',
    'quantity',
    'salePrice',
    'discount',
    'totalAmount',
    'action',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.productsService.getProducts().subscribe((result) => {
      this.products = result;
    });

    this.orderService.getOrders().subscribe((result) => {
      this.orders = result;
      this.dataSource.data = this.orders; // ✅ Set data directly
    });
  }

  // ✅ Assign paginator & sort after the view initializes
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getProductName(id: string): string {
    return this.products.find((p) => p.id === id)?.name || 'Unknown Product';
  }

  cancelOrder(order: Order) {
    // SweetAlert2 Confirmation Dialog
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to cancel this order. This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with deletion
        this.orderService.deleteOrder(order.id!).subscribe(() => {
          this.toaster.success('Order cancelled');

          // Fetch the product and update its available quantity
          this.productsService.getProduct(order.productId).subscribe((product) => {
            if (product) {
              product.availableQuantity = +product.availableQuantity + order.quantity!;
              this.productsService.updateProduct(product.id!, product).subscribe();
            }
          });

          // Remove the deleted order from the list and update the table
          this.orders = this.orders.filter((o) => o.id !== order.id);
          this.dataSource.data = [...this.orders]; // ✅ Ensures table updates

          // Show success message
          Swal.fire('Cancelled!', 'The order has been cancelled.', 'success');
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User cancelled, show a message
        Swal.fire('Cancelled', 'Your order is safe :)', 'error');
      }
    });
  }
}