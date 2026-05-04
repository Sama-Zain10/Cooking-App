import { Injectable, signal, computed, inject, Injector, runInInjectionContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { FavoritesService } from './favorites.service';
import { ShoppingListService } from './shopping-list.service';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private injector = inject(Injector);

  private apiUrl = `${environment.apiUrl}/auth`;

  private currentUserSignal = signal<User | null>(this.loadUserFromStorage());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);
  readonly userName = computed(() => this.currentUserSignal()?.name || 'Guest');

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setUser(response.data);
          runInInjectionContext(this.injector, () => {
            inject(FavoritesService).loadFavorites();
            inject(ShoppingListService).loadMyList();
          });
        }
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.setUser(response.data);
          runInInjectionContext(this.injector, () => {
            inject(FavoritesService).clearFavorites();
            inject(ShoppingListService).cartIngredients.set([]);
          });
        }
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.currentUserSignal.set(null);
    runInInjectionContext(this.injector, () => {
      inject(FavoritesService).clearFavorites();
      inject(ShoppingListService).cartIngredients.set([]);
    });
    this.router.navigate(['/login']);
  }

  getProfile(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/me`);
  }

  getToken(): string | null {
    return this.currentUserSignal()?.token || null;
  }

  private setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  private loadUserFromStorage(): User | null {
    const userData = localStorage.getItem('user');
    try {
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }
}