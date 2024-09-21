export class RecipeDto {
  tomato?: number;
  lemon?: number;
  potato?: number;
  rice?: number;
  ketchup?: number;
  lettuce?: number;
  onion?: number;
  cheese?: number;
  meat?: number;
  chicken?: number;
}

export class OrderDto {
  codeOrder: number;
  id: string;
  recipe: RecipeDto;
}
