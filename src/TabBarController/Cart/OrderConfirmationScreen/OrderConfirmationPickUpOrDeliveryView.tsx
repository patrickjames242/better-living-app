
import React, { useState } from 'react';
import {StyleSheet} from 'react-native';
import { Optional } from '../../../helpers/general';
import FloatingCellStyleSectionView from '../../../helpers/FloatingCellStyleSectionView';
import Spacer from '../../../helpers/Spacers/Spacer';
import OrderConfirmationLayoutConstants from './OrderConfirmationLayoutConstants';
import OrderConfirmationSelectableOptionView from './OrderConfirmationSelectableOptionView';

enum PickUpOrDelivery {
    pickUp,
    delivery
}


const OrderConfirmationPickUpOrDeliveryView = (() => {

    const styles = StyleSheet.create({
        root: {

        },
    });

    const OrderConfirmationPickUpOrDeliveryView = () => {

        const [pickUpOrDelivery, setPickUpOrDelivery] = useState<Optional<PickUpOrDelivery>>(null);

        return <FloatingCellStyleSectionView sectionTitle="Pick Up or Delivery" style={styles.root}>
            <Spacer space={OrderConfirmationLayoutConstants.selectableOptionViewSpacing}>
                <OrderConfirmationSelectableOptionView
                    imageSource={require('./icons/order.png')}
                    title="Pick up in person"
                    isSelected={pickUpOrDelivery === PickUpOrDelivery.pickUp}
                    onCheckMarkPressed={() => setPickUpOrDelivery(PickUpOrDelivery.pickUp)}
                />
                <OrderConfirmationSelectableOptionView
                    imageSource={require('./icons/motorcycle.png')}
                    title="Deliver to your door"
                    isSelected={pickUpOrDelivery === PickUpOrDelivery.delivery}
                    onCheckMarkPressed={() => setPickUpOrDelivery(PickUpOrDelivery.delivery)}
                />
            </Spacer>
        </FloatingCellStyleSectionView>
    }
    return OrderConfirmationPickUpOrDeliveryView;
})();


export default OrderConfirmationPickUpOrDeliveryView;