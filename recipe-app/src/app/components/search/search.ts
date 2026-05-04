import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, filter, catchError, map, tap } from 'rxjs/operators';
import { RecipeService } from '../../services/recipe';
import { Recipe } from '../../models/recipe.model';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class Search implements OnInit {
  private recipeService = inject(RecipeService);
  
  searchControl: FormControl = new FormControl('');
  searchResults$!: Observable<Recipe[]>;

  @Output() resultsFound = new EventEmitter<Recipe[]>();
  @Output() loading = new EventEmitter<boolean>();
  @Output() searchStatus = new EventEmitter<boolean>();
  ngOnInit(): void {
    this.onSearch(); 
  }
 onSearch(): void {
    this.searchResults$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((query: string) => {
        if (!query || query.length <= 2) {
          this.searchStatus.emit(false); 
          return false;
        }
        return true;
      }),
      tap(() => {
        this.loading.emit(true);
        this.searchStatus.emit(true); 
      }),
      switchMap((query: string) =>
        this.recipeService.searchRecipes(query).pipe(
          catchError(err => {
            console.error('Search error:', err);
            return of([]); 
          })
        )
      ),
      tap(results => {
        this.loading.emit(false);
        this.resultsFound.emit(results);
      })
    );
    this.searchResults$.subscribe();
  }
}
