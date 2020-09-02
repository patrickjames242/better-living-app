import { MealConfig } from "./MealCreaterScreen/helpers";
import { createStackNavigator } from "@react-navigation/stack";




export type MenuNavStackParams = {
    MealCreator: {defaultMealConfig: MealConfig},
    MenuListView: undefined,
    ProductDetail: {productId: number},
}


export const MenuNavStack = createStackNavigator<MenuNavStackParams>();
