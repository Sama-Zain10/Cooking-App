import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../models/recipe.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/favorites`;

  favs = signal<Recipe[]>([]);

  loadFavorites() {
    const token = localStorage.getItem('user');
    if (!token) {
      this.favs.set([]); 
      return;
    }

    this.http.get<{success: boolean, data: Recipe[]}>(this.apiUrl).subscribe({
      next: (res) => {
        this.favs.set(res.data || []);
      },
      error: (err) => {
        console.error('Error loading favorites', err);
        this.favs.set([]);
      }
    });
  }

  toggleFavorite(recipe: Recipe) {
    this.http.post(this.apiUrl, recipe).subscribe({
      next: () => this.loadFavorites() 
    });
  }
  isFavorite(id: string | number): boolean {
    return this.favs().some(r => r.id == id || r.id == id);
  }

  clearFavorites() {
    this.favs.set([]);
  }
}