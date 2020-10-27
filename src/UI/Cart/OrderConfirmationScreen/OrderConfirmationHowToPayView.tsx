
import React from 'react';
import {StyleSheet} from 'react-native';
import { Optional } from '../../../helpers/general';
import FloatingCellStyleSectionView from '../../../helpers/Views/FloatingCellStyleSectionView';
import Spacer from '../../../helpers/Spacers/Spacer';
import OrderConfirmationLayoutConstants from './OrderConfirmationLayoutConstants';
import OrderConfirmationSelectableOptionView from './OrderConfirmationSelectableOptionView';
import OrderConfirmationCardDetailsView from './OrderConfirmationCardDetailsView';


export enum HowToPay {
    inPerson,
    online
}

export interface OrderConfirmationHowToPayViewProps{
    value: Optional<HowToPay>;
    onValueChange: (value: Optional<HowToPay>) => void;
    payOnArrivalEnabled?: boolean;
}


const OrderConfirmationHowToPayView = (() => {

    const styles = StyleSheet.create({
        root: {

        },
    });

    const OrderConfirmationHowToPayView = (props: OrderConfirmationHowToPayViewProps) => {

        return <FloatingCellStyleSectionView sectionTitle="Pay In Person or Online" style={styles.root}>
            <Spacer space={OrderConfirmationLayoutConstants.selectableOptionViewSpacing}>
                <OrderConfirmationSelectableOptionView
                    imageSource={require('./icons/buy.png')}
                    title="Pay on arrival (in person)"
                    isSelected={props.value === HowToPay.inPerson}
                    onCheckMarkPressed={() => props.onValueChange(HowToPay.inPerson)}
                    isEnabled={props.payOnArrivalEnabled}
                />
                <OrderConfirmationSelectableOptionView
                    imageSource={require('./icons/pay.png')}
                    title="Pay online"
                    isSelected={props.value === HowToPay.online}
                    onCheckMarkPressed={() => props.onValueChange(HowToPay.online)}
                />
                <OrderConfirmationCardDetailsView isEnabled={props.value === HowToPay.online} />
            </Spacer>
        </FloatingCellStyleSectionView>
    }
    return OrderConfirmationHowToPayView;
})();

export default OrderConfirmationHowToPayView;



