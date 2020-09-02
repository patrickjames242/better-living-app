import React from 'react';
import CartItemListScreen from './CartItemListScreen/CartItemListScreen';
import { CartNavStack } from './navigationHelpers';
import OrderConfirmationScreen from './OrderConfirmationScreen/OrderConfirmationScreen';
import { DEFAULT_NAV_SCREEN_OPTIONS } from '../../helpers/general';
import { NavigationContainer } from '@react-navigation/native';



const Cart = React.memo(function _InnerCart(){
    return <NavigationContainer independent>
        <CartNavStack.Navigator initialRouteName="CartItemList" screenOptions={DEFAULT_NAV_SCREEN_OPTIONS}>
            <CartNavStack.Screen name="OrderingConfirmation" component={OrderConfirmationScreen}/>
            <CartNavStack.Screen name="CartItemList" component={CartItemListScreen}/>
        </CartNavStack.Navigator>
    </NavigationContainer>
});

export default Cart;
