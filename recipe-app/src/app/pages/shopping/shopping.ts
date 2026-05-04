import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListService } from '../../services/shopping-list.service';
import { Ingredient } from '../../models/recipe.model';
import { UnitConversionPipe } from '../../pipes/unit-conversion.pipe';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [CommonModule, UnitConversionPipe],
  templateUrl: './shopping.html',
  styleUrls: ['./shopping.css']
})
export class Shopping {
  public shoppingService = inject(ShoppingListService);

  removeItem(item: Ingredient): void {
    this.shoppingService.removeItem(item);
  }

  clearAll(): void {
    if (confirm('Are you sure you want to clear the entire list?')) {
      this.shoppingService.clearList();
    }
  }
}