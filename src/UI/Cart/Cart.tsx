import React from 'react';
import CartItemListScreen from './CartItemListScreen/CartItemListScreen';
import { CartNavStack } from './navigationHelpers';
import OrderConfirmationScreen from './OrderConfirmationScreen/OrderConfirmationScreen';
import { DEFAULT_NAV_SCREEN_OPTIONS } from '../../helpers/general';
import ProductDetailScreen from '../Menu/ProductDetailScreen/ProductDetailScreen';
import MealCreatorScreen from '../Menu/MealCreaterScreen/MealCreaterScreen';

const Cart = React.memo(function _InnerCart() {
  return (
    <CartNavStack.Navigator
      initialRouteName="CartItemList"
      screenOptions={DEFAULT_NAV_SCREEN_OPTIONS}
    >
      <CartNavStack.Screen
        name="OrderingConfirmation"
        component={OrderConfirmationScreen}
      />
      <CartNavStack.Screen name="CartItemList" component={CartItemListScreen} />
      <CartNavStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
      />
      <CartNavStack.Screen name="MealCreator" component={MealCreatorScreen} />
    </CartNavStack.Navigator>
  );
});

export default Cart;
