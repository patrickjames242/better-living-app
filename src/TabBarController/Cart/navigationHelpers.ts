import { createStackNavigator } from "@react-navigation/stack";


export type CartNavStackParamList = {
    OrderingConfirmation: undefined;
    CartItemList: undefined;
}

export const CartNavStack = createStackNavigator<CartNavStackParamList>();

