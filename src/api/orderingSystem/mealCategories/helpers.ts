import { MealCategoryResponseObj } from './validation';
import MealCategory from './MealCategory';

export function getMealCategoryFromResponseObj_orNull(
  apiResponseObj: MealCategoryResponseObj,
) {
  try {
    return new MealCategory(apiResponseObj);
  } catch (error) {
    console.error(
      'A meal product category could not be converted from json because of the following error ->',
      error,
      apiResponseObj,
    );
    return null;
  }
}
