import { handleProductsRealtimeUpdate } from './products/realtimeUpdates';
import { handleProductInfoTagsRealtimeUpdate } from './productInfoTags/realtimeUpdates';
import { handleMenusRealtimeUpdate } from './menus/realtimeUpdates';
import { handleMealsRealtimeUpdate } from './meals/realtimeUpdates';
import { handleMealCategoriesRealtimeUpdates } from './mealCategories/realtimeUpdates';

export function handleOrderingSystemRealtimeUpdate(json: any) {
  if (json == null || typeof json !== 'object') {
    return;
  }

  const Keys = {
    meal_product_categories: 'meal_product_categories',
    meals: 'meals',
    menus: 'menus',
    product_info_tags: 'product_info_tags',
    products: 'products',
  };

  for (const propertyName of Object.getOwnPropertyNames(json)) {
    const value = json[propertyName];
    if (value === undefined) {
      continue;
    }
    switch (propertyName) {
      case Keys.products:
        handleProductsRealtimeUpdate(value);
        break;
      case Keys.product_info_tags:
        handleProductInfoTagsRealtimeUpdate(value);
        break;
      case Keys.menus:
        handleMenusRealtimeUpdate(value);
        break;
      case Keys.meals:
        handleMealsRealtimeUpdate(value);
        break;
      case Keys.meal_product_categories:
        handleMealCategoriesRealtimeUpdates(value);
        break;
    }
  }
}
