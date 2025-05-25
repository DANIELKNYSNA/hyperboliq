// Ingredient interface
export interface IngredientInterface {
  id: string;
  name: string;
}

export interface InventorInterface {
  id: string;
  firstName: string;
  lastName: string;
}

export enum Difficulty {
  Unknown = 'Unknown',
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Expert = 'Expert'
}

export interface ElixirInterface {
  id: string;
  name: string;
  effect: string;
  sideEffects: string;
  characteristics: string;
  time: string;
  difficulty: Difficulty;
  ingredients: IngredientInterface[];
  inventors: InventorInterface[];
  manufacturer: string;
}
