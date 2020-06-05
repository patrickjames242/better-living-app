
import React, { useState } from 'react';
import {StyleSheet} from 'react-native';
import { Optional } from '../../../helpers/general';
import FloatingCellStyleSectionView from '../../../helpers/FloatingCellStyleSectionView';
import Spacer from '../../../helpers/Spacers/Spacer';
import OrderConfirmationLayoutConstants from './OrderConfirmationLayoutConstants';
import OrderConfirmationSelectableOptionView from './OrderConfirmationSelectableOptionView';
import OrderConfirmationCardDetailsView from './OrderConfirmationCardDetailsView';


enum HowToPay {
    inPerson,
    online
}


const OrderConfirmationHowToPayView = (() => {

    const styles = StyleSheet.create({
        root: {

        },
    });

    const OrderConfirmationHowToPayView = () => {

        const [howToPay, setHowToPay] = useState<Optional<HowToPay>>(null);

        return <FloatingCellStyleSectionView sectionTitle="Pay In Person or Online" style={styles.root}>
            <Spacer space={OrderConfirmationLayoutConstants.selectableOptionViewSpacing}>
                <OrderConfirmationSelectableOptionView
                    imageSource={require('./icons/buy.png')}
                    title="Pay on arrival (in person)"
                    isSelected={howToPay === HowToPay.inPerson}
                    onCheckMarkPressed={() => setHowToPay(HowToPay.inPerson)}
                />
                <OrderConfirmationSelectableOptionView
                    imageSource={require('./icons/pay.png')}
                    title="Pay online"
                    isSelected={howToPay === HowToPay.online}
                    onCheckMarkPressed={() => setHowToPay(HowToPay.online)}
                />
                <OrderConfirmationCardDetailsView/>
            </Spacer>
        </FloatingCellStyleSectionView>
    }
    return OrderConfirmationHowToPayView;
})();

export default OrderConfirmationHowToPayView;



