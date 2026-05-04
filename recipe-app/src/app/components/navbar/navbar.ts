import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ShoppingListService } from '../../services/shopping-list.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements OnInit { 
  authService = inject(AuthService);
  shoppingService = inject(ShoppingListService); 
  favoriteService = inject(FavoritesService);

  isLoggedIn = computed(() => this.authService.isLoggedIn());
  userName = computed(() => this.authService.userName());

  favCount = computed(() => this.favoriteService.favs().length);
  
  cartCount = computed(() => this.shoppingService.cartIngredients().length);

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.favoriteService.loadFavorites();
      this.shoppingService.loadMyList(); 
    }
  }

  logout(): void {
    this.authService.logout();
    this.favoriteService.clearFavorites(); 
  }
}