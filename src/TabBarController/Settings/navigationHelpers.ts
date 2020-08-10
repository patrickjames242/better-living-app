
import {createStackNavigator} from '@react-navigation/stack';

export type SettingsNavStackParams = {
    SettingsList: undefined;
    OrderingSystemSettingsList: undefined;
}

export const SettingsNavStack = createStackNavigator<SettingsNavStackParams>();

