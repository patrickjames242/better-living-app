
import React from 'react';
import SettingsListScreen from './SettingsListScreen/SettingsListScreen';
import { SettingsNavStack } from './navigationHelpers';
import { DEFAULT_NAV_SCREEN_OPTIONS } from '../../helpers/general';
import ProductsListScreen from './OrderingSystemSettings/ListScreens/ProductsListScreen';
import ProductEditOrCreationScreen from './OrderingSystemSettings/EditOrCreateScreens/ProductEditOrCreationScreen/ProductEditOrCreationScreen';
import MenusListScreen from './OrderingSystemSettings/ListScreens/MenusListScreen';
import MealsListScreen from './OrderingSystemSettings/ListScreens/MealsListScreen';
import MealCategoriesListScreen from './OrderingSystemSettings/ListScreens/MealCategoriesListScreen';
import MealCategoryEditOrCreationScreen from './OrderingSystemSettings/EditOrCreateScreens/MealCategoryEditOrCreationScreen/MealCategoryEditOrCreationScreen';
import OrderingSystemEditingProductsPickerScreen from './OrderingSystemSettings/EditOrCreateScreens/ItemPickerScreens/OrderingSystemEditingProductsPickerScreen';
import MealEditOrCreationScreen from './OrderingSystemSettings/EditOrCreateScreens/MealEditOrCreationScreen/MealEditOrCreationScreen';
import OrderingSystemEditingMealCategoriesPickerScreen from './OrderingSystemSettings/EditOrCreateScreens/ItemPickerScreens/OrderingSystemEditingMealCategoriesPickerScreen';
import MenuEditOrCreationScreen from './OrderingSystemSettings/EditOrCreateScreens/MenuEditOrCreationScreen/MenuEditOrCreationScreen';
import SettingsNameEditingScreen from './ProfileEditingScreens/SettingsNameEditingScreen';
import SettingsPhoneNumberEditingScreen from './ProfileEditingScreens/SettingsPhoneNumberEditingScreen';
import SettingsEmailEditingScreen from './ProfileEditingScreens/SettingsEmailEditingScreen';
import SettingsChangePasswordScreen from './ProfileEditingScreens/SettingsChangePasswordScreen';
import UserProfileSettingsScreen from './UserProfileSettingsScreen';
import MyOrdersListScreen from './MyOrdersListScreen/MyOrdersListScreen';
import OrderDetailScreen from '../TodaysOrders/OrderDetailScreen/OrderDetailScreen';
import OrdersHistoryScreen from './OrderingSystemSettings/OrdersHistoryScreen/OrdersHistoryScreen';
import AllowOrderingSwitchScreen from './OrderingSystemSettings/AllowOrderingScreen';
import OrderingSystemMoreSettingsScreen from './OrderingSystemSettings/OrderingSystemMoreSettingsScreen';


const Settings = () => {
    return <SettingsNavStack.Navigator initialRouteName="SettingsList" screenOptions={DEFAULT_NAV_SCREEN_OPTIONS}>

        <SettingsNavStack.Screen name="SettingsList" component={SettingsListScreen} />
        <SettingsNavStack.Screen name="ProductsList" component={ProductsListScreen} />
        <SettingsNavStack.Screen name="MenusList" component={MenusListScreen} />
        <SettingsNavStack.Screen name="MealsList" component={MealsListScreen} />
        <SettingsNavStack.Screen name="MealCategoriesList" component={MealCategoriesListScreen} />

        <SettingsNavStack.Screen name="ProductEditOrCreate" component={ProductEditOrCreationScreen} />
        <SettingsNavStack.Screen name="MealCategoryEditOrCreate" component={MealCategoryEditOrCreationScreen} />
        <SettingsNavStack.Screen name="ProductsPicker" component={OrderingSystemEditingProductsPickerScreen} />
        <SettingsNavStack.Screen name="MealEditOrCreate" component={MealEditOrCreationScreen} />
        <SettingsNavStack.Screen name="MealCategoriesPicker" component={OrderingSystemEditingMealCategoriesPickerScreen} />
        <SettingsNavStack.Screen name="MenuEditOrCreate" component={MenuEditOrCreationScreen} />

        <SettingsNavStack.Screen name="UserProfileSettings" component={UserProfileSettingsScreen} />
        <SettingsNavStack.Screen name="NameEditing" component={SettingsNameEditingScreen} />
        <SettingsNavStack.Screen name="PhoneNumberEditing" component={SettingsPhoneNumberEditingScreen} />
        <SettingsNavStack.Screen name="EmailEditing" component={SettingsEmailEditingScreen} />
        <SettingsNavStack.Screen name="ChangePassword" component={SettingsChangePasswordScreen} />

        <SettingsNavStack.Screen name="MyOrders" component={MyOrdersListScreen} />
        <SettingsNavStack.Screen name="OrderDetail" component={OrderDetailScreen} />
        <SettingsNavStack.Screen name="OrdersHistory" component={OrdersHistoryScreen} />

        <SettingsNavStack.Screen name="AllowOrderingSwitch" component={AllowOrderingSwitchScreen}/>
        <SettingsNavStack.Screen name="OrderingSystemMoreSettings" component={OrderingSystemMoreSettingsScreen}/>
    </SettingsNavStack.Navigator>
};

export default React.memo(Settings);