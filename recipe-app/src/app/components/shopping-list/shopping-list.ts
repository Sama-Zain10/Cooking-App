import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListService } from '../../services/shopping-list.service';
import { Ingredient } from '../../models/recipe.model';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './shopping-list.html',
  styleUrls: ['./shopping-list.css']
})
export class ShoppingList implements OnInit {
  public shoppingService = inject(ShoppingListService);
  
  isOpen = false;

  ngOnInit(): void {
    this.shoppingService.loadMyList();
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  removeItem(item: Ingredient): void {
    this.shoppingService.removeItem(item);
  }

  clearList(): void {
    this.shoppingService.clearList();
  }
}