
import { List } from "immutable";
import { MealJsonResponseObj, mealResponseObjValidator } from "./validation";
import getErrorObjFromApiObjValidateFunction from "../../helpers";

interface MealProductCategoryEntry{
    id: number;
    orderNumber: number;
}

export default class Meal{

    readonly id: number;
    readonly title: string;
    readonly price: number;
    readonly productCategories: List<MealProductCategoryEntry>;

    constructor(mealJsonResponseObj: MealJsonResponseObj){

        if (mealResponseObjValidator(mealJsonResponseObj) === false){
            throw getErrorObjFromApiObjValidateFunction(mealResponseObjValidator, 'Meal');
        }

        const json = mealJsonResponseObj;

        this.id = json.id;
        this.title = json.title;
        this.price = json.price;
        this.productCategories = List(json.product_categories.map<MealProductCategoryEntry>(x => ({
            id: x.id,
            orderNumber: x.order_num,
        })));
    }

}

