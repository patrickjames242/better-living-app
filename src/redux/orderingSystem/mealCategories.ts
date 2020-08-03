import { CustomReduxAction } from "../helpers";
import { List, Map } from "immutable";
import MealCategory from "../../api/orderingSystem/mealCategories/MealCategory";
import ActionStrings from "../actionStrings";


export type UpdateAllMealCategoriesAction = CustomReduxAction<{allMealCategories: List<MealCategory>}>;

export function updateAllMealCategoriesAction(allMealCategories: List<MealCategory>): UpdateAllMealCategoriesAction{
    return {
        type: ActionStrings.orderingSystem.mealCategories.UPDATE_ALL_MEAL_CATEGORIES,
        allMealCategories,
    }
}


export type InsertOrUpdateMealCategoryAction = CustomReduxAction<{mealCategory: MealCategory}>;

export function insertOrUpdateMealCategoryAction(mealCategory: MealCategory): InsertOrUpdateMealCategoryAction{
    return {
        type: ActionStrings.orderingSystem.mealCategories.INSERT_OR_UPDATE_MEAL_CATEGORY,
        mealCategory,
    }
}


export type DeleteMealCategoryAction = CustomReduxAction<{mealCategoryId: number}>;

export function deleteMealCategoryAction(mealCategoryId: number): DeleteMealCategoryAction{
    return {
        type: ActionStrings.orderingSystem.mealCategories.DELETE_MEAL_CATEGORY,
        mealCategoryId,
    }
}

export type MealCategoryActions = UpdateAllMealCategoriesAction | InsertOrUpdateMealCategoryAction | DeleteMealCategoryAction;

export function mealCategoriesReducer(state = Map<number, MealCategory>(), action: MealCategoryActions){
    const strings = ActionStrings.orderingSystem.mealCategories;
    switch (action.type){
        case strings.UPDATE_ALL_MEAL_CATEGORIES:{
            const mealCategories = (action as UpdateAllMealCategoriesAction).allMealCategories;
            return Map(mealCategories.map(x => [x.id, x]));
        }
        case strings.INSERT_OR_UPDATE_MEAL_CATEGORY: {
            const mealCategory = (action as InsertOrUpdateMealCategoryAction).mealCategory;
            return state.set(mealCategory.id, mealCategory);
        }
        case strings.DELETE_MEAL_CATEGORY: {
            const mealCategoryId = (action as DeleteMealCategoryAction).mealCategoryId;
            return state.remove(mealCategoryId);
        }
        default: return state;
    }
}