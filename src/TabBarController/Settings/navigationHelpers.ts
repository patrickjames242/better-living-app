
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
        onFinishedSelectingProducts: (productIds: Set<number>) => void
    }
}

export const SettingsNavStack = createStackNavigator<SettingsNavStackParams>();

