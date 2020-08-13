
import React from 'react';
import SettingsListScreen from './SettingsListScreen/SettingsListScreen';
import { NavigationContainer } from '@react-navigation/native';
import { SettingsNavStack } from './navigationHelpers';
import { DEFAULT_NAV_SCREEN_OPTIONS } from '../../helpers/general';
import OrderingSystemSettingsListScreen from './OrderingSystemSettings/OrderingSystemSettingsListScreen/OrderingSystemSettingsListScreen';
import ProductsListScreen from './OrderingSystemSettings/ListScreens/ProductsListScreen';
import ProductEditOrCreationScreen from './OrderingSystemSettings/ProductEditOrCreationScreen/ProductEditOrCreationScreen';
import MenusListScreen from './OrderingSystemSettings/ListScreens/MenusListScreen';
import MealsListScreen from './OrderingSystemSettings/ListScreens/MealsListScreen';
import MealCategoriesListScreen from './OrderingSystemSettings/ListScreens/MealCategoriesListScreen';


export default function Settings(){
    return <NavigationContainer>
        <SettingsNavStack.Navigator initialRouteName="SettingsList" screenOptions={DEFAULT_NAV_SCREEN_OPTIONS}>
            <SettingsNavStack.Screen name="SettingsList" component={SettingsListScreen}/>
            <SettingsNavStack.Screen name="OrderingSystemSettingsList" component={OrderingSystemSettingsListScreen}/>
            <SettingsNavStack.Screen name="ProductsList" component={ProductsListScreen}/>
            <SettingsNavStack.Screen name="ProductEditOrCreate" component={ProductEditOrCreationScreen}/>
            <SettingsNavStack.Screen name="MenusList" component={MenusListScreen}/>
            <SettingsNavStack.Screen name="MealsList" component={MealsListScreen}/>
            <SettingsNavStack.Screen name="MealCategoriesList" component={MealCategoriesListScreen}/>
        </SettingsNavStack.Navigator>
    </NavigationContainer>
}

