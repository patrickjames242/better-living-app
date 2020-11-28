
import React from 'react';
import {StyleSheet} from 'react-native';
import FloatingCellStyleSectionView from '../../../helpers/Views/FloatingCellStyleSectionView';
import Spacer from '../../../helpers/Spacers/Spacer';
import OrderConfirmationLayoutConstants from './OrderConfirmationLayoutConstants';
import OrderConfirmationSelectableOptionView from './OrderConfirmationSelectableOptionView';
import OrderConfirmationCardDetailsView from './OrderConfirmationCardDetailsView';
import { HowToPay, OrderConfirmationScreenValues, PickUpOrDelivery } from './helpers';
import { useFormikContext } from '../../../helpers/formik';




export interface OrderConfirmationHowToPayViewProps{

}


const OrderConfirmationHowToPayView = (() => {

    const styles = StyleSheet.create({
        root: {

        },
    });

    const OrderConfirmationHowToPayView = (props: OrderConfirmationHowToPayViewProps) => {

        const formikContext = useFormikContext<OrderConfirmationScreenValues>();
        return <FloatingCellStyleSectionView sectionTitle="Pay In Person or Online" style={styles.root}>
            <Spacer space={OrderConfirmationLayoutConstants.selectableOptionViewSpacing}>
                <OrderConfirmationSelectableOptionView
                    imageSource={require('./icons/buy.png')}
                    title="Pay on arrival (in person)"
                    isSelected={formikContext.values.howToPay === HowToPay.inPerson}
                    onCheckMarkPressed={() => formikContext.setFieldValue('howToPay', HowToPay.inPerson)}
                    isEnabled={formikContext.values.pickUpOrDelivery !== PickUpOrDelivery.delivery}
                />
                <OrderConfirmationSelectableOptionView
                    imageSource={require('./icons/pay.png')}
                    title="Pay online"
                    isSelected={formikContext.values.howToPay === HowToPay.online}
                    onCheckMarkPressed={() => formikContext.setFieldValue('howToPay', HowToPay.online)}
                />
                <OrderConfirmationCardDetailsView isEnabled={formikContext.values.howToPay === HowToPay.online} />
            </Spacer>
        </FloatingCellStyleSectionView>
    }
    return OrderConfirmationHowToPayView;
})();

export default OrderConfirmationHowToPayView;



