
import React from 'react';
import {StyleSheet} from 'react-native';
import { Optional } from '../../../helpers/general';
import FloatingCellStyleSectionView from '../../../helpers/Views/FloatingCellStyleSectionView';
import Spacer from '../../../helpers/Spacers/Spacer';
import OrderConfirmationLayoutConstants from './OrderConfirmationLayoutConstants';
import OrderConfirmationSelectableOptionView from './OrderConfirmationSelectableOptionView';

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
            </Spacer>
        </FloatingCellStyleSectionView>
    }
    return OrderConfirmationPickUpOrDeliveryView;
})();


export default OrderConfirmationPickUpOrDeliveryView;