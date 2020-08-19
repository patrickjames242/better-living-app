
import React from 'react';
import SettingsListScreen from './SettingsListScreen/SettingsListScreen';
import { NavigationContainer } from '@react-navigation/native';
import { SettingsNavStack } from './navigationHelpers';
import { DEFAULT_NAV_SCREEN_OPTIONS } from '../../helpers/general';
import OrderingSystemSettingsListScreen from './OrderingSystemSettings/OrderingSystemSettingsListScreen/OrderingSystemSettingsListScreen';
import ProductsListScreen from './OrderingSystemSettings/ListScreens/ProductsListScreen';
import ProductEditOrCreationScreen from './OrderingSystemSettings/EditOrCreateScreens/ProductEditOrCreationScreen/ProductEditOrCreationScreen';
import MenusListScreen from './OrderingSystemSettings/ListScreens/MenusListScreen';
import MealsListScreen from './OrderingSystemSettings/ListScreens/MealsListScreen';
import MealCategoriesListScreen from './OrderingSystemSettings/ListScreens/MealCategoriesListScreen';
import MealCategoryEditOrCreationScreen from './OrderingSystemSettings/EditOrCreateScreens/MealCategoryEditOrCreationScreen/MealCategoryEditOrCreationScreen';
import OrderingSystemEditingProductsPickerScreen from './OrderingSystemSettings/EditOrCreateScreens/ItemPickerScreens/OrderingSystemEditingProductsPickerScreen';
import MealEditOrCreationScreen from './OrderingSystemSettings/EditOrCreateScreens/MealEditOrCreationScreen/MealEditOrCreationScreen';
import OrderingSystemEditingMealCategoriesPickerScreen from './OrderingSystemSettings/EditOrCreateScreens/ItemPickerScreens/OrderingSystemEditingMealCategoriesPickerScreen';


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
            <SettingsNavStack.Screen name="MealCategoryEditOrCreate" component={MealCategoryEditOrCreationScreen}/>
            <SettingsNavStack.Screen name="ProductsPicker" component={OrderingSystemEditingProductsPickerScreen}/>
            <SettingsNavStack.Screen name="MealEditOrCreate" component={MealEditOrCreationScreen}/>
            <SettingsNavStack.Screen name="MealCategoriesPicker" component={OrderingSystemEditingMealCategoriesPickerScreen}/>
        </SettingsNavStack.Navigator>
    </NavigationContainer>
}

