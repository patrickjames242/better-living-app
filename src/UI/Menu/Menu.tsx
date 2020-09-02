

import React from 'react';
import MenuListScreen from './MenuListViewScreen/MenuListViewScreen';
import { NavigationContainer } from '@react-navigation/native';
import { MenuNavStack } from './navigationHelpers';
import MealCreaterScreen from './MealCreaterScreen/MealCreaterScreen';
import ProductDetailScreen from './ProductDetailScreen/ProductDetailScreen';
import { DEFAULT_NAV_SCREEN_OPTIONS } from '../../helpers/general';



const Menu = React.memo(function _InnerMenu(){
    return <NavigationContainer independent>
        <MenuNavStack.Navigator initialRouteName="MenuListView" screenOptions={DEFAULT_NAV_SCREEN_OPTIONS}>
            <MenuNavStack.Screen name="MealCreator" component={MealCreaterScreen}/>
            <MenuNavStack.Screen name="ProductDetail" component={ProductDetailScreen}/>
            <MenuNavStack.Screen name="MenuListView" component={MenuListScreen}/>
        </MenuNavStack.Navigator>
    </NavigationContainer>
});

export default Menu;


