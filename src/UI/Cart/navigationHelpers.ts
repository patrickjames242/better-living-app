import { createStackNavigator } from "@react-navigation/stack";
import { MenuNavStackParams } from "../Menu/navigationHelpers";


export type CartNavStackParamList = {
    OrderingConfirmation: undefined;
    CartItemList: undefined;
    ProductDetail: MenuNavStackParams['ProductDetail'];
    MealCreator: MenuNavStackParams['MealCreator'];
}

export const CartNavStack = createStackNavigator<CartNavStackParamList>();

