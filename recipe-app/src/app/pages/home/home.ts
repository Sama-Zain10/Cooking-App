import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Search } from '../../components/search/search';
import { RecipeGrid } from '../../components/recipe-grid/recipe-grid';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Search, RecipeGrid],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  recipesSignal = signal<Recipe[]>([]);
  loading = false;
  searchPerformed = false;

  uniqueRecipes = computed(() => {
    const data = this.recipesSignal();
    return Array.from(
      new Map(data.map(recipe => [recipe.id, recipe])).values()
    );
  });

  onResults(results: Recipe[]): void {
    this.recipesSignal.set(results);
    this.searchPerformed = true;
    this.loading = false;
  }

  onLoading(state: boolean): void {
    this.loading = state;
    if (state) {
      this.searchPerformed = false;
      this.recipesSignal.set([]);
    }
  }
}


// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [CommonModule],
//   template: `<h1>Home works</h1>`,
// })
// export class Home {}