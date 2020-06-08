import React from 'react';
import NavigationController from '../../helpers/NavigationController/NavigationController';
import MenuListScreen from './MenuListViewScreen/MenuListViewScreen';



const Menu = React.memo(function _InnerMenu(){
    return <NavigationController initialComponent={<MenuListScreen/>}/>
});

export default Menu;


