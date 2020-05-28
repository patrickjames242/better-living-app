import React from 'react';
import NavigationController from '../../helpers/NavigationController/NavigationController';
import CartItemListScreen from './CartItemListScreen/CartItemListScreen';



export default function Cart(){
    return <NavigationController initialComponent={<CartItemListScreen/>}/>
}

