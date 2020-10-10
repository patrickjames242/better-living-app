import { createStackNavigator } from "@react-navigation/stack"


export type TodaysOrdersNavStackParams = {
    TodaysOrdersList: undefined;
    OrderDetail: {orderId: string};
}

export const TodaysOrdersNavStack = createStackNavigator<TodaysOrdersNavStackParams>();

