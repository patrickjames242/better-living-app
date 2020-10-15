import { createStackNavigator } from "@react-navigation/stack"
import Order from "../../api/orders/Order";


export type TodaysOrdersNavStackParams = {
    TodaysOrdersList: undefined;
    OrderDetail: {order: Order} | {reduxOrderId: string};
}

export const TodaysOrdersNavStack = createStackNavigator<TodaysOrdersNavStackParams>();

