
import React from 'react';
import {StyleSheet} from 'react-native';
import { Optional } from '../../../helpers/general';
import FloatingCellStyleSectionView from '../../../helpers/Views/FloatingCellStyleSectionView';
import Spacer from '../../../helpers/Spacers/Spacer';
import OrderConfirmationLayoutConstants from './OrderConfirmationLayoutConstants';
import OrderConfirmationSelectableOptionView from './OrderConfirmationSelectableOptionView';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import { CustomFont } from '../../../helpers/fonts/fonts';
import { CustomColors } from '../../../helpers/colors';
import AppSettings from '../../../settings';

export enum PickUpOrDelivery {
    pickUp,
    delivery
}

export interface OrderConfirmationPickUpOrDeliveryViewProps{
    value: Optional<PickUpOrDelivery>;
    onValueChange: (newValue: Optional<PickUpOrDelivery>) => void;
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

        return <FloatingCellStyleSectionView sectionTitle="Pick Up or Delivery" style={styles.root}>
            <Spacer space={OrderConfirmationLayoutConstants.selectableOptionViewSpacing}>
                <OrderConfirmationSelectableOptionView
                    imageSource={require('./icons/order.png')}
                    title="Pick up in person"
                    isSelected={props.value === PickUpOrDelivery.pickUp}
                    onCheckMarkPressed={() => props.onValueChange(PickUpOrDelivery.pickUp)}
                />
                <OrderConfirmationSelectableOptionView
                    imageSource={require('./icons/motorcycle.png')}
                    title="Deliver to your door"
                    isSelected={props.value === PickUpOrDelivery.delivery}
                    onCheckMarkPressed={() => props.onValueChange(PickUpOrDelivery.delivery)}
                />
                {props.value === PickUpOrDelivery.delivery && 
                    <CustomizedText style={styles.bottomMessageText}>
                        {`If you want your order delivered you MUST call our delivery driver at ${AppSettings.deliveryDriverPhoneNumber}, inform him of the order and give him your directions. You are also required to pay him a delivery fee with cash.`}
                    </CustomizedText>}
            </Spacer>
        </FloatingCellStyleSectionView>
    }
    return OrderConfirmationPickUpOrDeliveryView;
})();


export default OrderConfirmationPickUpOrDeliveryView;