export interface Recipe {
  id: number;
  title: string;
  image: string;
  preptime: number;
  summary?: string;
  ingredients?: Ingredient[];
  isFavorite?: boolean;
}

export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  recipeTitle?: string;
}

export interface SearchResponse {
  results: Recipe[];
  offset: number;
  number: number;
  totalResults: number;
}
