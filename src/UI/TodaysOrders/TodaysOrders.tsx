import React from 'react';
import TodaysOrdersListScreen from './InquiriesListScreen/TodaysOrdersListScreen';
import { NavigationContainer } from '@react-navigation/native';
import { TodaysOrdersNavStack } from './navigationHelpers';
import { DEFAULT_NAV_SCREEN_OPTIONS } from '../../helpers/general';



export default function TodaysOrders(){
    return <NavigationContainer independent>
        <TodaysOrdersNavStack.Navigator initialRouteName="TodaysOrdersList" screenOptions={DEFAULT_NAV_SCREEN_OPTIONS}>
            <TodaysOrdersNavStack.Screen name="TodaysOrdersList" component={TodaysOrdersListScreen}/>
        </TodaysOrdersNavStack.Navigator>
    </NavigationContainer>
}
