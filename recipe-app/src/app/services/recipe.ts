import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, forkJoin } from 'rxjs';
import { environment } from '../../environments/environment';
import { Recipe, Ingredient } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl: string = environment.mealDbUrl;
  private http: HttpClient = inject(HttpClient);

  searchRecipes(query: string): Observable<Recipe[]> {
  return this.http.get<any>(`${this.apiUrl}/search.php?s=${query}`).pipe(
    map(response => {
      return (response.meals || []).map((meal: any) => this.mapToRecipe(meal));
    })
  );
 }

  getRecipeDetails(id: number): Observable<Recipe> {
    return this.http.get<any>(`${this.apiUrl}/lookup.php?i=${id}`).pipe(
      map(response => this.mapToRecipe(response.meals[0]))
    );
  }
  // 🛠️ Helpers
  private mapToRecipe(meal: any): Recipe {
    return {
      id: parseInt(meal.idMeal),
      title: meal.strMeal,
      image: meal.strMealThumb,
      preptime: 30,
      summary: meal.strInstructions,
      ingredients: this.extractIngredients(meal)
    };
  }
private extractIngredients(meal: any): Ingredient[] {
  const ingredientMap = new Map<string, Ingredient>();

  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`]?.trim();
    const measure = meal[`strMeasure${i}`]?.trim();

    if (name) {
      const measureParts = (measure || '').split(' ');
      let amount = parseFloat(measureParts[0]) || 1;
      let unit = measureParts.slice(1).join(' ') || 'piece';

      if ((unit === 'piece' || unit === 'pieces') && amount > 10) unit = 'g';
      
      const key = name.toLowerCase(); 

      if (ingredientMap.has(key)) {
        const existing = ingredientMap.get(key)!;
        if (existing.unit === unit) {
          existing.amount += amount;
        }
      } else {
        ingredientMap.set(key, {
          id: i,
          name: name,
          amount: amount,
          unit: unit
        });
      }
    }
  }

  return Array.from(ingredientMap.values());
}
}