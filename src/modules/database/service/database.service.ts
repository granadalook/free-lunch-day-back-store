import { Injectable } from '@nestjs/common';
import { RecipeDto } from 'src/modules/store/dto/order.dto';

@Injectable()
export class DatabaseService {
  market: { product: string; amount: number; date: Date }[] = [];
  private ingredients: RecipeDto = {
    tomato: 5,
    lemon: 5,
    potato: 5,
    rice: 5,
    ketchup: 5,
    lettuce: 5,
    onion: 5,
    cheese: 5,
    meat: 5,
    chicken: 5,
  };

  getListIngredients(): RecipeDto {
    return { ...this.ingredients };
  }

  updateListIngredients(updatedIngredients: RecipeDto): void {
    for (const key in updatedIngredients) {
      if (updatedIngredients[key] !== undefined) {
        this.ingredients[key] = updatedIngredients[key];
      }
    }
  }
  updateIngredients(update: RecipeDto): RecipeDto {
    for (const key in update) {
      if (update[key] !== undefined && this.ingredients[key] !== undefined) {
        this.ingredients[key] += update[key];
      }
    }
    return this.ingredients;
  }
  getVisitMarket(): Array<{ product: string; amount: number }> {
    return this.market;
  }
  addVisitMarket(product: string, amount: number): void {
    const date = new Date();
    this.market.push({ product, amount, date });
  }
}
