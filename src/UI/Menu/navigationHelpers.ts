import { MealConfig } from "./MealCreaterScreen/helpers";
import { createStackNavigator } from "@react-navigation/stack";
import { CartMealEntry } from "../../api/cart/CartMealEntry";




export type MenuNavStackParams = {
    // MealCreator: {mealToCreateEntryFor: MealConfig} | {mealEntryToEdit: CartMealEntry},
    MealCreator: {defaultMealConfig: MealConfig},
    MenuListView: undefined,
    ProductDetail: {productId: number},
}


export const MenuNavStack = createStackNavigator<MenuNavStackParams>();
