import React from 'react';
import NavigationController from '../../helpers/NavigationController/NavigationController';
import MenuListScreen from './MenuListViewScreen/MenuListViewScreen';
// import MenuItemDetailScreen from './MenuItemDetailScreen/MenuItemDetailScreen';


export default function Menu(){
    return <NavigationController initialComponent={<MenuListScreen/>}/>
    // return <NavigationController initialComponent={<MenuItemDetailScreen/>}/>
}
