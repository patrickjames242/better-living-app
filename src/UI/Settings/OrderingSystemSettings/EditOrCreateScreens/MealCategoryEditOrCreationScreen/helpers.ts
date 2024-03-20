import { Set } from 'immutable';

export interface MealCategoryEditOrCreateValues {
  displayName: string;
  uniqueName: string;
  productIds: Set<number>;
}
