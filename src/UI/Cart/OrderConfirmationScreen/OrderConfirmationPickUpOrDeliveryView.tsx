
import React, { useContext, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import FloatingCellStyleSectionView from '../../../helpers/Views/FloatingCellStyleSectionView';
import Spacer from '../../../helpers/Spacers/Spacer';
import OrderConfirmationLayoutConstants from './OrderConfirmationLayoutConstants';
import OrderConfirmationSelectableOptionView from './OrderConfirmationSelectableOptionView';
import { CustomFont } from '../../../helpers/fonts/fonts';
import { CustomColors } from '../../../helpers/colors';
import { HowToPay, OrderConfirmationScreenContext, OrderConfirmationScreenValues, PickUpOrDelivery } from './helpers';
import { useFormikContext } from '../../../helpers/formik';
import LayoutConstants from '../../../LayoutConstants';
import { FormikMultilineTextFieldView } from '../../../helpers/Views/FormikTextFieldView';
import { useSelector } from '../../../redux/store';
import currency from 'currency.js';
import { Optional } from '../../../helpers/general';
import AsyncStorage from '@react-native-community/async-storage';

export interface OrderConfirmationPickUpOrDeliveryViewProps {

}

const OrderConfirmationPickUpOrDeliveryView = (() => {

    const styles = StyleSheet.create({
        root: {

        },
        bottomMessageText: {
            marginLeft: 15,
            marginRight: 15,
            fontFamily: CustomFont.medium,
            color: CustomColors.redColor.stringValue,
            fontSize: 14,
        },
    });

    const OrderConfirmationPickUpOrDeliveryView = (props: OrderConfirmationPickUpOrDeliveryViewProps) => {

        const formikContext = useFormikContext<OrderConfirmationScreenValues>();
        const deliveryFee = useSelector(state => state.globalSettings.deliveryFee);
        const orderConfirmationScreenContext = useContext(OrderConfirmationScreenContext);

        return <FloatingCellStyleSectionView sectionTitle="Pick Up or Delivery" style={styles.root}>
            <Spacer space={OrderConfirmationLayoutConstants.selectableOptionViewSpacing}>
                <OrderConfirmationSelectableOptionView
                    imageSource={require('./icons/order.png')}
                    title="Pick up in person"
                    isSelected={formikContext.values.pickUpOrDelivery === PickUpOrDelivery.pickUp}
                    onCheckMarkPressed={() => formikContext.setFieldValue('pickUpOrDelivery', PickUpOrDelivery.pickUp)}
                />
                <OrderConfirmationSelectableOptionView
                    imageSource={require('./icons/motorcycle.png')}
                    title={["Deliver to your door", ...(deliveryFee > 0 ? [`(adds ${currency(deliveryFee).format()})`] : [])].join(' ')}
                    isSelected={formikContext.values.pickUpOrDelivery === PickUpOrDelivery.delivery}
                    onCheckMarkPressed={() => {
                        if (orderConfirmationScreenContext.isOnlinePaymentAllowed){
                            formikContext.setValues(prevValues => ({
                                ...prevValues,
                                howToPay: HowToPay.online,
                                pickUpOrDelivery: PickUpOrDelivery.delivery,
                            }));
                        } else {
                            formikContext.setFieldValue('pickUpOrDelivery', PickUpOrDelivery.delivery);
                        }
                    }}
                />
                {formikContext.values.pickUpOrDelivery === PickUpOrDelivery.delivery &&
                    <DeliveryDirections />}
            </Spacer>
        </FloatingCellStyleSectionView>
    }
    return OrderConfirmationPickUpOrDeliveryView;
})();

export default OrderConfirmationPickUpOrDeliveryView;



interface DeliveryDirectionsProps {

}

const DeliveryDirections = (() => {

    const styles = StyleSheet.create({
        root: {
            padding: LayoutConstants.floatingCellStyles.padding,
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            backgroundColor: 'white',
        },
    });

    const DeliveryDirections = (props: DeliveryDirectionsProps) => {

        const latestTimerId = useRef<Optional<number>>(null);

        return <View style={styles.root}>
            <FormikMultilineTextFieldView<OrderConfirmationScreenValues>
                formikFieldName="deliveryDirections"
                topTitleText="Please provide directions for your delivery"
                onChangeText={text => {
                    latestTimerId.current != null && clearTimeout(latestTimerId.current);
                    latestTimerId.current = setTimeout(() => {
                        AsyncStorage.setItem(OrderConfirmationLayoutConstants.cachedDeliveryDirectionsKey, text.trim());
                        latestTimerId.current = null;
                    }, 500);
                }}
            />
        </View>
    }
    return DeliveryDirections;
})();


