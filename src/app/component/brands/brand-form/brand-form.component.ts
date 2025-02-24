import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrandService } from '../../../services/brand.service';
import { ActivatedRoute, Router } from '@angular/router';
import Brand from '../../../types/brand';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, FormsModule, CommonModule],
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.scss',
})
export class BrandFormComponent {
  name!: string;
  brand!: Brand | null;  // Allow brand to be null initially

  brandService = inject(BrandService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.brandService.getBrand(id).subscribe((result) => {
        this.brand = result;
        this.name = result.name as string;  // Ensure name is correctly assigned
      });
    } else {
      this.brand = null;  // Ensure brand is null if no ID is provided
    }
  }

  addBrand() {
    console.log(this.name);
    if (!this.name) {  // Check if the name is empty or falsy
      alert('Please enter a brand name');
      return;
    }

    let brand: Brand = {
      name: this.name,  // Don't pass `id` if creating a new brand
    };

    this.brandService.addBrand(brand).subscribe((result) => {
      alert('Brand added successfully');
      this.router.navigate(['/brands']);
    });
  }

  updateBrand() {
    console.log(this.name);
    if (!this.name) {  // Check if the name is empty or falsy
      alert('Please enter a brand name');
      return;
    }

    if (!this.brand) {
      alert('Brand not found for update');
      return;
    }

    let updatedBrand: Brand = {
      id: this.brand.id,  // Ensure the brand ID is passed for updating
      name: this.name,
    };

    this.brandService.updateBrand(updatedBrand).subscribe((result) => {
      alert('Brand updated successfully');
      this.router.navigate(['/brands']);
    });
  }
}
