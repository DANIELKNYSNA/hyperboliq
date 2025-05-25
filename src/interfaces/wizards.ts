// Elixir interface
export interface ElixirInterface {
  id: string;
  name: string;
}

// Main wizard/character interface
export interface WizardInterface {
  elixirs: ElixirInterface[];
  id: string;
  firstName: string;
  lastName: string;
}