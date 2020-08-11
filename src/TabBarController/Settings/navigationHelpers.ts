
import {createStackNavigator} from '@react-navigation/stack';
import { Optional } from '../../helpers/general';

export type SettingsNavStackParams = {
    SettingsList: undefined;
    OrderingSystemSettingsList: undefined;
    ProductsList: undefined;
    ProductEditOrCreate: {productId: Optional<number>}
}

export const SettingsNavStack = createStackNavigator<SettingsNavStackParams>();

