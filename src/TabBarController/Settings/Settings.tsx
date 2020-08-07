
import React from 'react';
import SettingsListScreen from './SettingsListScreen/SettingsListScreen';
import { NavigationContainer } from '@react-navigation/native';
import { SettingsNavStack } from './navigationHelpers';
import { DEFAULT_NAV_SCREEN_OPTIONS } from '../../helpers/general';


export default function Settings(){
    return <NavigationContainer>
        <SettingsNavStack.Navigator initialRouteName="SettingsList" screenOptions={DEFAULT_NAV_SCREEN_OPTIONS}>
            <SettingsNavStack.Screen name="SettingsList" component={SettingsListScreen}/>
        </SettingsNavStack.Navigator>
    </NavigationContainer>
}

