
import {createStackNavigator} from '@react-navigation/stack';
import { Optional } from '../../helpers/general';

export type SettingsNavStackParams = {
    SettingsList: undefined;
    OrderingSystemSettingsList: undefined;
    ProductsList: undefined;
    ProductEditOrCreate: {productId: Optional<number>};
    MenusList: undefined;
    MealsList: undefined;
    MealCategoriesList: undefined;
}

export const SettingsNavStack = createStackNavigator<SettingsNavStackParams>();

