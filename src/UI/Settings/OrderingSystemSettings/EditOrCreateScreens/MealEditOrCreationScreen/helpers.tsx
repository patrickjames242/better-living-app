import { Set } from 'immutable';

export interface MealEditOrCreationValues {
  title: string;
  priceString: string;
  productCategoryIds: Set<number>;
}
