import React from 'react';
import NavigationController from '../../helpers/NavigationController/NavigationController';
import MenuListScreen from './MenuListViewScreen/MenuListViewScreen';



export default function Menu(){
    return <NavigationController initialComponent={<MenuListScreen/>}/>
}


