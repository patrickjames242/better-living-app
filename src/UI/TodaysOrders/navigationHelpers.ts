import { createStackNavigator } from "@react-navigation/stack"


export type TodaysOrdersNavStackParams = {
    TodaysOrdersList: undefined;
}

export const TodaysOrdersNavStack = createStackNavigator<TodaysOrdersNavStackParams>();

