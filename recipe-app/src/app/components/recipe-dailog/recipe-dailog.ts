import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { RecipeService } from '../../services/recipe';
import { ShoppingListService } from '../../services/shopping-list.service';
import { Recipe } from '../../models/recipe.model';
import { UnitConversionPipe } from '../../pipes/unit-conversion.pipe';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, UnitConversionPipe],
  templateUrl: './recipe-dailog.html',
  styleUrls: ['./recipe-dailog.css']
})
export class RecipeDetails implements OnInit {
  private recipeService = inject(RecipeService);
  private shoppingService = inject(ShoppingListService);
  
  recipe: Recipe | null = null;
  loading = true;

  constructor(
    public dialogRef: MatDialogRef<RecipeDetails>,
    @Inject(MAT_DIALOG_DATA) public data: { recipeId: string | number }
  ) {}

 ngOnInit(): void {
  if (this.data.recipeId) {
    const idToFetch = +this.data.recipeId; 

    this.recipeService.getRecipeDetails(idToFetch).subscribe({
      next: (recipe) => {
        this.recipe = recipe;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
  addIngredientsToList(): void {
    if (this.recipe?.ingredients) {
      this.shoppingService.addItems(this.recipe.ingredients);
      this.dialogRef.close(); // نقفل الديالوج بعد الإضافة
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}