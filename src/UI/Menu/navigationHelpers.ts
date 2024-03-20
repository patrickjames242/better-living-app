import { createStackNavigator } from '@react-navigation/stack';
import { CartMealEntry } from '../../api/cart/CartMealEntry';

export const MealCreatorPropKeys: {
  readonly mealIdToCreateEntryFor: 'mealIdToCreateEntryFor';
  readonly mealEntryToEdit: 'mealEntryToEdit';
  readonly defaultSelectedProductId: 'defaultSelectedProductId';
} = {
  mealIdToCreateEntryFor: 'mealIdToCreateEntryFor',
  mealEntryToEdit: 'mealEntryToEdit',
  defaultSelectedProductId: 'defaultSelectedProductId',
};

export type MenuNavStackParams = {
  MealCreator:
    | {
        [MealCreatorPropKeys.mealIdToCreateEntryFor]: number;
        [MealCreatorPropKeys.defaultSelectedProductId]?: number;
      }
    | { [MealCreatorPropKeys.mealEntryToEdit]: CartMealEntry };
  MenuListView: undefined;
  ProductDetail: { productId: number };
};

export const MenuNavStack = createStackNavigator<MenuNavStackParams>();
