import React from 'react';
import MenuListScreen from './MenuListViewScreen/MenuListViewScreen';
import { MenuNavStack } from './navigationHelpers';
import MealCreaterScreen from './MealCreaterScreen/MealCreaterScreen';
import ProductDetailScreen from './ProductDetailScreen/ProductDetailScreen';
import { DEFAULT_NAV_SCREEN_OPTIONS } from '../../helpers/general';

const Menu = () => {
  return (
    <MenuNavStack.Navigator
      initialRouteName="MenuListView"
      screenOptions={DEFAULT_NAV_SCREEN_OPTIONS}
    >
      <MenuNavStack.Screen name="MealCreator" component={MealCreaterScreen} />
      <MenuNavStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
      />
      <MenuNavStack.Screen name="MenuListView" component={MenuListScreen} />
    </MenuNavStack.Navigator>
  );
};

export default React.memo(Menu);
