import { MealJsonKeys } from './validation';
import { fetchFromAPI, HttpMethod } from '../../api';
import Meal from './Meal';
import store from '../../../redux/store';
import {
  insertOrUpdateMealAction,
  deleteMealAction,
} from '../../../redux/orderingSystem/meals';

const basePath = 'ordering-system/meals/';

export interface MealRequestObj {
  [MealJsonKeys.title]: string;
  [MealJsonKeys.price]: number;
  [MealJsonKeys.product_categories]?: {
    [MealJsonKeys.ProductCategory.id]: number;
    [MealJsonKeys.ProductCategory.order_num]: number;
  }[];
}

export function createNewMeal(requestObj: MealRequestObj) {
  return fetchFromAPI({
    method: HttpMethod.post,
    path: basePath + 'create/',
    jsonBody: requestObj,
  }).then(response => {
    const meal = new Meal(response);
    store.dispatch(insertOrUpdateMealAction(meal));
    return meal;
  });
}

export function updateMeal(
  mealId: number,
  requestObj: Partial<MealRequestObj>,
) {
  return fetchFromAPI({
    method: HttpMethod.put,
    path: basePath + mealId + '/',
    jsonBody: requestObj,
  }).then(response => {
    const meal = new Meal(response);
    store.dispatch(insertOrUpdateMealAction(meal));
    return meal;
  });
}

export function deleteMeal(mealId: number) {
  return fetchFromAPI({
    method: HttpMethod.delete,
    path: basePath + mealId + '/',
  }).then(() => {
    store.dispatch(deleteMealAction(mealId));
  });
}
