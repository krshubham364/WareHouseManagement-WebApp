import { Component, inject, ViewChild, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import Product from '../../types/product';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
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
    MatFormFieldModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  dataSource!: MatTableDataSource<Product>;
  productService = inject(ProductService);
  products: Product[] = [];
  
  displayedColumns = [
    'name', 'details', 'brandId', 'purchasePrice', 'salePrice', 'availableQuantity', 'action'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.productService.getProducts().subscribe(result => {
      this.products = result;
      this.initTable();
    });
  }

  initTable() {
    if (this.products.length > 0) {
      this.dataSource = new MatTableDataSource(this.products);

      // Assign paginator and sort after the view has initialized
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.paginator.firstPage(); // Ensures the paginator resets correctly
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
