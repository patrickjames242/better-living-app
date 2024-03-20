import Meal from './Meal';
import { getMealFromResponseObj_orNull } from './helpers';
import store from '../../../redux/store';
import {
  updateAllMealsAction,
  insertOrUpdateMealAction,
  deleteMealAction,
} from '../../../redux/orderingSystem/meals';
import { getOrderingSystemObjRealtimeUpdater } from '../helpers';

export const handleMealsRealtimeUpdate =
  getOrderingSystemObjRealtimeUpdater<Meal>({
    jsonObjConverter: getMealFromResponseObj_orNull,
    allObjectsStateUpdater: allMeals =>
      store.dispatch(updateAllMealsAction(allMeals)),
    insertOrUpdateStateUpdater: meal =>
      store.dispatch(insertOrUpdateMealAction(meal)),
    deleteStateUpdater: id => store.dispatch(deleteMealAction(id)),
  });
