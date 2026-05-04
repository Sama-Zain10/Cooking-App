import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeGrid } from '../../components/recipe-grid/recipe-grid';
import { FavoritesService } from '../../services/favorites.service'; 

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RecipeGrid],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.css']
})
export class Favorites implements OnInit {
  private favoriteService = inject(FavoritesService);

  recipes = computed(() => this.favoriteService.favs());
  favoritesCount = computed(() => this.favoriteService.favs().length);
  
  loading = false;

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.loading = true;
    this.favoriteService.loadFavorites();
    
    // الأفضل ننتظر ثواني بسيطة للتأكد من وصول الداتا
    setTimeout(() => {
      this.loading = false;
    }, 600);
  }
}