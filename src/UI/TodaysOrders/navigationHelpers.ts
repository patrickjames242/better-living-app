import { createStackNavigator } from '@react-navigation/stack';
import Order from '../../api/orders/Order';

export type TodaysOrdersNavStackParams = {
  TodaysOrdersList: undefined;
  OrderDetail: { onOrderUpdate?: (order: Order) => void } & (
    | { order: Order }
    | { reduxOrderId: string }
  );
};

export const TodaysOrdersNavStack =
  createStackNavigator<TodaysOrdersNavStackParams>();
