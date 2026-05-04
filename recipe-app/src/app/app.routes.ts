import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
    title: 'Login',
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
    title: 'Sign Up',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    title: 'Recipe Cookbook - Home',
  },
  {
    path: 'favorites',
    loadComponent: () => import('./pages/favorites/favorites').then((m) => m.Favorites),
    canActivate: [authGuard], 
    title: 'My Favorites',
  },
  {
    path: 'shopping',
    loadComponent: () => import('./pages/shopping/shopping').then((m) => m.Shopping),
    canActivate: [authGuard], 
    title: 'Shopping List',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];