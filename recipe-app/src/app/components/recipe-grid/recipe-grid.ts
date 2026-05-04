import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../models/recipe.model';
import { RecipeCard } from '../recipe-card/recipe-card';

@Component({
  selector: 'app-recipe-grid',
  standalone: true,
  imports: [CommonModule, RecipeCard],
  templateUrl: './recipe-grid.html',
  styleUrls: ['./recipe-grid.css']
})
export class RecipeGrid {
  @Input() recipes: Recipe[] = [];
  @Input() loading: boolean = false;
  displayRecipes(): void {
    console.log('Displaying recipes in grid...');
  }

  trackById(index: number, recipe: Recipe): number {
    return recipe.id;
  }
}