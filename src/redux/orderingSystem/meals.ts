import { CustomReduxAction } from '../helpers';
import { List, Map } from 'immutable';
import Meal from '../../api/orderingSystem/meals/Meal';
import ActionStrings from '../actionStrings';

export type UpdateAllMealsAction = CustomReduxAction<{ allMeals: List<Meal> }>;

export function updateAllMealsAction(
  allMeals: List<Meal>,
): UpdateAllMealsAction {
  return {
    type: ActionStrings.orderingSystem.meals.UPDATE_ALL_MEALS,
    allMeals,
  };
}

export type InsertOrUpdateMealAction = CustomReduxAction<{ meal: Meal }>;

export function insertOrUpdateMealAction(meal: Meal) {
  return {
    type: ActionStrings.orderingSystem.meals.INSERT_OR_UPDATE_MEAL,
    meal,
  };
}

export type DeleteMealAction = CustomReduxAction<{ mealId: number }>;

export function deleteMealAction(mealId: number): DeleteMealAction {
  return {
    type: ActionStrings.orderingSystem.meals.DELETE_MEAL,
    mealId,
  };
}

export type MealActions =
  | UpdateAllMealsAction
  | InsertOrUpdateMealAction
  | DeleteMealAction;

export function mealsReducer(state = Map<number, Meal>(), action: MealActions) {
  const strings = ActionStrings.orderingSystem.meals;
  switch (action.type) {
    case strings.UPDATE_ALL_MEALS: {
      const allMeals = (action as UpdateAllMealsAction).allMeals;
      return Map(allMeals.map(x => [x.id, x]));
    }
    case strings.INSERT_OR_UPDATE_MEAL: {
      const meal = (action as InsertOrUpdateMealAction).meal;
      return state.set(meal.id, meal);
    }
    case strings.DELETE_MEAL: {
      const mealId = (action as DeleteMealAction).mealId;
      return state.remove(mealId);
    }
    default:
      return state;
  }
}
