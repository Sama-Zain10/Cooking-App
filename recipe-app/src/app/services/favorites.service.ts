import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/favorites'; 

  favs = signal<any[]>([]);

  loadFavorites() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        const favoritesArray = res.data || res; 
        this.favs.set(favoritesArray);
      },
      error: (err) => console.error('Error loading favorites', err)
    });
  }

  toggleFavorite(recipe: Recipe) {
    const recipeId = String(recipe.id || (recipe as any).recipeId);

    console.log('recipe object:', recipe);
    console.log('recipeId to use:', recipeId);

    if (this.isFavorite(recipeId)) {
      this.http.delete(`${this.apiUrl}/${recipeId}`).subscribe({
        next: () => this.loadFavorites(),
        error: (err) => console.error('Error deleting favorite', err)
      });
    } else {
      const dataToSend = {
        recipeId: recipeId,
        title: recipe.title,
        image: recipe.image
      };
      this.http.post(this.apiUrl, dataToSend).subscribe({
        next: () => this.loadFavorites(),
        error: (err) => console.error('Error adding favorite', err)
      });
    }
  }

  isFavorite(id: any): boolean {
    const searchId = String(id);
    return this.favs().some(r => 
      String(r.recipeId) === searchId || String(r.id) === searchId
    );
  }

  clearFavorites() {
    this.favs.set([]);
  }
}