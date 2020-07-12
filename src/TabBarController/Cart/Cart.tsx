import React from 'react';
import NavigationController from '../../helpers/NavigationController/NavigationController';
import CartItemListScreen from './CartItemListScreen/CartItemListScreen';



const Cart = React.memo(function _InnerCart(){
    return <NavigationController initialComponent={<CartItemListScreen/>}/>
});

export default Cart;
