
import React from 'react';
import NavigationController from '../../helpers/NavigationController/NavigationController';
import SettingsListScreen from './SettingsListScreen/SettingsListScreen';


export default function Settings(){
    return <NavigationController initialComponent={<SettingsListScreen/>}/>
}

