import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; 
import { Recipe } from '../../models/recipe.model';
import { FavoritesService } from '../../services/favorites.service';
import { ShoppingListService } from '../../services/shopping-list.service';
import { RecipeDetails } from '../recipe-dailog/recipe-dailog';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './recipe-card.html',
  styleUrls: ['./recipe-card.css']
})
export class RecipeCard {
  @Input() recipe!: Recipe;
  
  private dialog = inject(MatDialog);
  favoriteService = inject(FavoritesService);
  shoppingService = inject(ShoppingListService);

  get isFav(): boolean {
    // نستخدم المعرف المتاح سواء id أو _id
    const id = this.recipe.id || this.recipe.id || '';
    return this.favoriteService.isFavorite(id);
  }

  addtoFavourites(event: Event): void {
    event.stopPropagation(); 
    if (this.recipe) {
      this.favoriteService.toggleFavorite(this.recipe);
    }
  }

  openDetails(): void {
    this.dialog.open(RecipeDetails, {
      data: { recipeId: this.recipe.id || this.recipe.id },
      width: '600px',
      panelClass: 'recipe-dialog-container' // تقدري تستخدمي الكلاس ده في الـ CSS
    });
  }

  addToShoppingList(event: Event): void {
    event.stopPropagation(); 
    if (this.recipe.ingredients && this.recipe.ingredients.length > 0) {
      this.shoppingService.addItems(this.recipe.ingredients);
      // alert('Ingredients added! 🛒'); // اختياري
    }
  }
}