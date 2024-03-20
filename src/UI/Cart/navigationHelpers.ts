import { createStackNavigator } from '@react-navigation/stack';
import { CartEntriesMapValue, CartEntry } from '../../redux/cart';
import { MenuNavStackParams } from '../Menu/navigationHelpers';

export type CartNavStackParamList = {
  OrderingConfirmation: { cartEntries: CartEntriesMapValue[] };
  CartItemList: undefined;
  ProductDetail: MenuNavStackParams['ProductDetail'];
  MealCreator: MenuNavStackParams['MealCreator'];
};

export const CartNavStack = createStackNavigator<CartNavStackParamList>();
