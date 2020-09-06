
import {createStackNavigator} from '@react-navigation/stack';
import { Optional } from '../../helpers/general';
import { Set } from 'immutable';

export type SettingsNavStackParams = {
    SettingsList: undefined;
    OrderingSystemSettingsList: undefined;
    ProductsList: undefined;
    ProductEditOrCreate: {productId: Optional<number>};
    MenusList: undefined;
    MealsList: undefined;
    MealCategoriesList: undefined;
    MealCategoryEditOrCreate: {mealCategoryId: Optional<number>};
    ProductsPicker: {
        currentSelectedProductIds: Set<number>, 
        onFinishedSelectingProducts: (productIds: Set<number>) => void,
    };
    MealEditOrCreate: {mealId: Optional<number>};
    MealCategoriesPicker: {
        currentSelectedCategoryIds: Set<number>,
        onFinishedSelectingCategories: (categoryIds: Set<number>) => void,
    };
    MenuEditOrCreate: {menuId: Optional<number>};
    NameEditing: undefined;
    EmailEditing: {password: string};
    PhoneNumberEditing: undefined;
    ChangePassword: {currentPassword: string};
    
}

export const SettingsNavStack = createStackNavigator<SettingsNavStackParams>();

