import { List } from 'immutable';

export interface MealConfigCategoryChoice {
  categoryId: number;
  chosenProductId: number;
}

export interface MealConfig {
  mealId: number;
  choices?: List<MealConfigCategoryChoice>;
}
