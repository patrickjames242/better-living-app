import { getOrderingSystemObjRealtimeUpdater } from '../helpers';
import { getMealCategoryFromResponseObj_orNull } from './helpers';
import MealCategory from './MealCategory';
import store from '../../../redux/store';
import {
  updateAllMealCategoriesAction,
  insertOrUpdateMealCategoryAction,
  deleteMealCategoryAction,
} from '../../../redux/orderingSystem/mealCategories';

export const handleMealCategoriesRealtimeUpdates =
  getOrderingSystemObjRealtimeUpdater<MealCategory>({
    jsonObjConverter: getMealCategoryFromResponseObj_orNull,
    allObjectsStateUpdater: allObjects =>
      store.dispatch(updateAllMealCategoriesAction(allObjects)),
    insertOrUpdateStateUpdater: mealCategory =>
      store.dispatch(insertOrUpdateMealCategoryAction(mealCategory)),
    deleteStateUpdater: id => store.dispatch(deleteMealCategoryAction(id)),
  });
