import { MealJsonResponseObj } from "./validation";
import Meal from "./Meal";


export function getMealFromResponseObj_orNull(apiResponseObj: MealJsonResponseObj){
    try{
        return new Meal(apiResponseObj);
    } catch (error){
        console.error('A meal could not be converted from json because of the following error ->', error, apiResponseObj);
        return null;
    }
}