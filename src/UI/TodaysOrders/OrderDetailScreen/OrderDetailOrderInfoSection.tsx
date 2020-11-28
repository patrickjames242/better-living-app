import React, { useCallback, useMemo, useState } from 'react';
import {StyleSheet, View, Image} from 'react-native';
import { UserType } from '../../../api/authentication/validation';
import Order from '../../../api/orders/Order';
import { updateOrderIsCompleted } from '../../../api/orders/requests';
import { displayErrorMessage } from '../../../helpers/Alerts';
import RoundedTextBouncyButton from '../../../helpers/Buttons/RoundedTextBouncyButton';
import { CustomFont } from '../../../helpers/fonts/fonts';
import Space from '../../../helpers/Spacers/Space';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import { useSelector } from '../../../redux/store';
import { OrderDetailScreenConstants } from './helpers';
import OrderDetailTitleContainer from './OrderDetailTitleContainer';
import currency from 'currency.js';
import { useCalculatedPriceInfoForOrder } from '../../../api/orders/helpers';

interface OrderInfoSectionProps {
    order: Order;
    onOrderUpdate: (order: Order) => void;
}

const OrderInfoSection = (() => {

    const styles = StyleSheet.create({
        root: {

        },
        segmentView: {

        },
        segmentTitle: {
            fontFamily: CustomFont.medium,
            color: OrderDetailScreenConstants.subtitleColor,
            marginBottom: 2.5,
        },
        segmentValueText: {
            fontSize: 16,
            fontFamily: CustomFont.medium,
            color: OrderDetailScreenConstants.titleColor,
            flex: 1,
        },
        segmentValueWithImageHolder: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 2.5,
        },
        segmentValueImage: {
            height: 20,
            width: 20,
        },
        setCompletedButtonStyle: {
            alignSelf: 'flex-start',
            marginTop: 12,
        },
    });

    const SegmentView = (props: React.PropsWithChildren<{ title: string, value?: string, imageSource?: any }>) => {
        return <View style={styles.segmentView}>
            <CustomizedText style={styles.segmentTitle}>{props.title}</CustomizedText>
            {(() => {
                if (props.value == null) return props.children;
                else if (props.value != null) {
                    if (props.imageSource != null) {
                        return <View style={styles.segmentValueWithImageHolder}>
                            <Image style={styles.segmentValueImage} source={props.imageSource} />
                            <Space space={7} />
                            <CustomizedText style={styles.segmentValueText}>{props.value}</CustomizedText>
                        </View>
                    } else {
                        return <CustomizedText style={styles.segmentValueText}>{props.value}</CustomizedText>
                    }
                }
            })()}
        </View>
    }

    const OrderInfoSection = (props: OrderInfoSectionProps) => {

        const { order, onOrderUpdate } = props;


        const totalPrice = useCalculatedPriceInfoForOrder(order).total;

        const [completedIsLoading, setCompletedIsLoading] = useState(false);

        const toggleCompleted = useCallback(() => {
            setCompletedIsLoading(true);
            updateOrderIsCompleted(order.id, !order.isCompleted).then(order => {
                onOrderUpdate(order);
            }).catch(error => {
                displayErrorMessage(error.message);
            }).finally(() => {
                setCompletedIsLoading(false);
            });
        }, [onOrderUpdate, order.id, order.isCompleted]);

        const isUserEmployeeOrManager = useSelector(state => {
            const currentUserType = state.authentication?.userObject.userType ?? UserType.customer;
            return [UserType.employee, UserType.manager].includes(currentUserType);
        });

        return <OrderDetailTitleContainer title="Order Info">
            <View style={{ flexDirection: 'row' }}>
                <SpacerView space={15} style={{ flex: 1, }}>
                    <SegmentView title="Order Number">
                        <CustomizedText style={styles.segmentValueText}>{'#' + props.order.orderNum}</CustomizedText>
                    </SegmentView>
                    <SegmentView title="Payment Method" imageSource={props.order.userPaidOnline ? require('../../Cart/OrderConfirmationScreen/icons/pay.png') : require('../../Cart/OrderConfirmationScreen/icons/buy.png')} value={props.order.userPaidOnline ? "Paid Online" : "Payment In Person"} />
                    <SegmentView title="Completion Status" value={props.order.isCompleted ? "Completed" : "Incomplete"} />
                </SpacerView>
                <Space space={10} />
                <SpacerView space={15} style={{ flex: 1, }}>
                    <SegmentView title="Order Date">
                        <CustomizedText style={styles.segmentValueText}>{props.order.creationDate.format('LLL')}</CustomizedText>
                    </SegmentView>
                    <SegmentView title="Pick Up Or Delivery" imageSource={props.order.userWantsOrderDelivered ? require('../../Cart/OrderConfirmationScreen/icons/motorcycle.png') : require('../../Cart/OrderConfirmationScreen/icons/order.png')} value={props.order.userWantsOrderDelivered ? "Delivery" : "Pick Up"} />
                    <SegmentView title="Total Price" value={currency(totalPrice).format()} />
                </SpacerView>
            </View>
            {isUserEmployeeOrManager && <RoundedTextBouncyButton isEnabled={completedIsLoading === false} text={completedIsLoading ? 'Loading...' : (props.order.isCompleted ? "Mark Incomplete" : "Mark Complete")} style={styles.setCompletedButtonStyle} onPress={toggleCompleted} />}
        </OrderDetailTitleContainer>
    }
    return OrderInfoSection;
})();

export default OrderInfoSection;