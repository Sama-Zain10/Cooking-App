import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Ingredient } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/shopping`;

  cartIngredients = signal<Ingredient[]>([]);

  readonly itemCount = computed(() => this.cartIngredients().length);
  readonly isEmpty = computed(() => this.cartIngredients().length === 0);

loadMyList() {
  const token = localStorage.getItem('token');
  if (!token) return;

  const headers = { 'Authorization': `Bearer ${token}` };

  this.http.get<{success: boolean, data: any[]}>(this.apiUrl, { headers }).subscribe({
    next: (res) => {
      this.cartIngredients.set(res.data || []);
    },
    error: (err) => {
      console.error('Error loading shopping list:', err);
    }
  });
}
  addItems(ingredients: Ingredient[]): void {
    const updatedList = [...this.cartIngredients(), ...ingredients];
    this.http.post(this.apiUrl, { ingredients: updatedList }).subscribe({
      next: () => this.cartIngredients.set(updatedList)
    });
  }

  removeItem(item: Ingredient): void {
    const updated = this.cartIngredients().filter(i => i.id !== item.id);
    this.http.post(this.apiUrl, { ingredients: updated }).subscribe({
      next: () => this.cartIngredients.set(updated)
    });
  }

  clearList(): void {
    this.http.delete(this.apiUrl).subscribe({
      next: () => this.cartIngredients.set([])
    });
  }
}