import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Product from '../types/product';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:3000';

  httpClient=inject(HttpClient);
  constructor() { }
  getProducts(){

    //return this.httpClient.get<Product[]>('http://localhost:3000/products');
    
    return this.httpClient.get<Product[]>(`${this.apiUrl}/products`);
  }


  addProduct(product:Product){
    return this.httpClient.post<Product>(`${this.apiUrl}/products`, product);
  }

  getProduct(id: string){
    return this.httpClient.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  updateProduct(id:string,product: Product){
    return this.httpClient.put<Product>(`${this.apiUrl}/products/${id}`, product);
  }

}
