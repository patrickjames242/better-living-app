
import {createStackNavigator} from '@react-navigation/stack';

export type SettingsNavStackParams = {
    SettingsList: undefined;
}

export const SettingsNavStack = createStackNavigator<SettingsNavStackParams>();

