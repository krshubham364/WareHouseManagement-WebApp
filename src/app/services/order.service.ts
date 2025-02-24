import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Order from '../types/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:3000';

  httpClient = inject(HttpClient);

  constructor() {}

  getOrders() {
    return this.httpClient.get<Order[]>(this.apiUrl + '/orders');
  }

  addOrder(order: Order) {
    return this.httpClient.post<Order>(this.apiUrl + '/orders', order);
  }

  getOrder(id: string) {
    return this.httpClient.get<Order>(this.apiUrl + '/orders/' + id);
  }

  updateOrder(id: string, order: Order) {
    return this.httpClient.put<Order>(this.apiUrl + '/orders/' + id, order);
  }

  deleteOrder(id:string){
    return this.httpClient.delete(this.apiUrl + '/orders/' + id);
  }
}