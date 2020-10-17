
import React from 'react';
import TodaysOrdersListScreen from './TodaysOrdersListScreen/TodaysOrdersListScreen';
import { TodaysOrdersNavStack } from './navigationHelpers';
import { DEFAULT_NAV_SCREEN_OPTIONS } from '../../helpers/general';
import OrderDetailScreen from './OrderDetailScreen/OrderDetailScreen';


export default function TodaysOrders() {
    return <TodaysOrdersNavStack.Navigator initialRouteName="TodaysOrdersList" screenOptions={DEFAULT_NAV_SCREEN_OPTIONS}>
        <TodaysOrdersNavStack.Screen name="TodaysOrdersList" component={TodaysOrdersListScreen} />
        <TodaysOrdersNavStack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </TodaysOrdersNavStack.Navigator>
}
