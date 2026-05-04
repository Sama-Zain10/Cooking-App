import { Component, Input, inject, computed } from '@angular/core';
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

  // استخدام computed لمراقبة التغيير في الـ Signal فوراً
  isFav = computed(() => {
    if (!this.recipe) return false;
    const id = this.recipe.id || (this.recipe as any).recipeId;
    return this.favoriteService.isFavorite(id);
  });

  addtoFavourites(event: Event): void {
    event.stopPropagation(); 
    if (this.recipe) {
      this.favoriteService.toggleFavorite(this.recipe);
    }
  }

  openDetails(): void {
  const id = this.recipe.id || (this.recipe as any).recipeId; 
  this.dialog.open(RecipeDetails, {
    data: { recipeId: id },
    width: '600px',
    panelClass: 'recipe-dialog-container'
  });
}

  addToShoppingList(event: Event): void {
    event.stopPropagation(); 
    if (this.recipe.ingredients && this.recipe.ingredients.length > 0) {
      this.shoppingService.addItems(this.recipe.ingredients);
    }
  }
}