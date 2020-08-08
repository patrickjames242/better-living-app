
import { MealCategoryJsonKeys } from "./validation";
import { Optional } from "../../../helpers/general";
import { fetchFromAPI, HttpMethod } from "../../api";
import MealCategory from "./MealCategory";
import store from "../../../redux/store";
import { insertOrUpdateMealCategoryAction, deleteMealCategoryAction } from "../../../redux/orderingSystem/mealCategories";


const basePath = 'ordering-system/meals/categories/'


interface MealCategoriesRequestObj{
    [MealCategoryJsonKeys.unique_name]: string;
    [MealCategoryJsonKeys.display_name]?: Optional<string>;
    [MealCategoryJsonKeys.product_ids]?: number[];
}

export function createNewMealCategory(requestObj: MealCategoriesRequestObj){
    return fetchFromAPI({
        method: HttpMethod.post,
        path: basePath + 'create/',
        jsonBody: requestObj,
    }).then(response => {
        const mealCategory = new MealCategory(response);
        store.dispatch(insertOrUpdateMealCategoryAction(mealCategory));
        return mealCategory;
    });
}

export function updateMealCategory(mealCategoryId: number, requestObj: Partial<MealCategoriesRequestObj>){
    return fetchFromAPI({
        method: HttpMethod.put,
        path: basePath + mealCategoryId + '/',
        jsonBody: requestObj,
    }).then(response => {
        const mealCategory = new MealCategory(response);
        store.dispatch(insertOrUpdateMealCategoryAction(mealCategory));
        return mealCategory;
    });
}

export function deleteMealCategory(mealCategoryId: number){
    return fetchFromAPI({
        method: HttpMethod.delete,
        path: basePath + mealCategoryId + '/',
    }).then(() => {
        store.dispatch(deleteMealCategoryAction(mealCategoryId));
    });
}

