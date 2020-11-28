
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Order from '../../../api/orders/Order';
import { Color, CustomColors } from '../../../helpers/colors';
import Spacer from '../../../helpers/Spacers/Spacer';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import NavigationControllerNavigationBar from '../../../helpers/Views/NavigationControllerNavigationBar';
import ResourceNotFoundView from '../../../helpers/Views/ResourceNotFoundView';
import LayoutConstants from '../../../LayoutConstants';
import { useSelector } from '../../../redux/store';
import { TodaysOrdersNavStackParams } from '../navigationHelpers';
import OrderDetailTitleContainer from './OrderDetailTitleContainer';
import OrderSubtotalsView from './OrderDetailSubtotalsView';
import OrderItemsView from './OrderDetailOrderItemsView';
import CustomerProfileSection from './OrderDetailCustomerProfileSection';
import OrderInfoSection from './OrderDetailOrderInfoSection';



const OrderDetailScreen = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        scrollView: {
        },
        scrollViewContainer: {
            ...LayoutConstants.maxWidthListContentContainerStyles(500)
        },
        separatorLine: {
            marginTop: LayoutConstants.floatingCellStyles.padding,
            marginBottom: LayoutConstants.floatingCellStyles.padding,
            height: StyleSheet.hairlineWidth,
            backgroundColor: Color.gray(0.9).stringValue,
        },
        deliveryDisclaimerText: {
            fontSize: 14,
            color: CustomColors.redColor.stringValue,
        }
    });

    const OrderDetailScreen = (props: StackScreenProps<TodaysOrdersNavStackParams, 'OrderDetail'>) => {

        const reduxOrder = useSelector(state => {
            if ('reduxOrderId' in props.route.params && typeof props.route.params.reduxOrderId === 'string')
                return state.todaysOrders.get(props.route.params.reduxOrderId);
            else if ('order' in props.route.params && props.route.params.order instanceof Order)
                return state.todaysOrders.get(props.route.params.order.id);
            else return undefined;
        });

        const orderToUse = (() => {
            if (reduxOrder instanceof Order) {
                return reduxOrder;
            } else if ('order' in props.route.params && props.route.params.order instanceof Order) {
                return props.route.params.order;
            }
        })();

        const onOrderUpdate = props.route.params.onOrderUpdate;

        const updateOrder = useCallback((order: Order) => {
            props.navigation.setParams({ order: order, reduxOrderId: undefined });
            onOrderUpdate?.(order);
        }, [onOrderUpdate, props.navigation]);

        return <View style={styles.root}>
            <NavigationControllerNavigationBar title="Order Details" />
            {(() => {
                if (orderToUse == null) {
                    return <ResourceNotFoundView />
                } else {
                    return <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
                        <Spacer space={15}>
                            <OrderInfoSection order={orderToUse} onOrderUpdate={updateOrder} />
                            <CustomerProfileSection user={orderToUse.user} />
                            {
                                orderToUse.userWantsOrderDelivered && orderToUse.deliveryDirections &&
                                <OrderDetailTitleContainer title="Delivery Directions">
                                    <CustomizedText>{orderToUse.deliveryDirections}</CustomizedText>
                                </OrderDetailTitleContainer>
                            }
                            <OrderItemsView orderDetailsJson={orderToUse.detailsJson} />
                            <OrderSubtotalsView order={orderToUse} />
                        </Spacer>
                    </ScrollView>
                }
            })()}
        </View>
    }
    return OrderDetailScreen;
})();

export default OrderDetailScreen;




