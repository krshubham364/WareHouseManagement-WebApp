import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Brand from '../types/brand';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private apiUrl = 'http://localhost:3000'; // Define API URL

  constructor(private httpClient: HttpClient) {} // Correct way to inject HttpClient

  getBrands() {
    //return this.httpClient.get<Brand[]>(this.apiUrl);
    return this.httpClient.get<Brand[]>(`${this.apiUrl}/brands`);
  }

  addBrand(brand:Brand) {
    return this.httpClient.post<Brand>(`${this.apiUrl}/brands`, brand);
}

getBrand(brandId:string) {
  return this.httpClient.get<Brand>(`${this.apiUrl}/brands/${brandId}`);
}

updateBrand(brand:Brand) {
  return this.httpClient.put<Brand>(`${this.apiUrl}/brands/${brand.id}`, brand);
}
}