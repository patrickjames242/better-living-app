
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import NavigationControllerNavigationBar from '../../../helpers/Views/NavigationControllerNavigationBar';
import FloatingCellStyleSectionView from '../../../helpers/Views/FloatingCellStyleSectionView';
import CartTotalSummaryView from '../CartItemListTotalSummaryView';
import LayoutConstants from '../../../LayoutConstants';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import OrderConfirmationPickUpOrDeliveryView, { PickUpOrDelivery } from './OrderConfirmationPickUpOrDeliveryView';
import OrderConfirmationHowToPayView, { HowToPay } from './OrderConfirmationHowToPayView';
import LongTextAndIconButton from '../../../helpers/Buttons/LongTextAndIconButton';
import Space from '../../../helpers/Spacers/Space';
import { ScrollView } from 'react-native-gesture-handler';
import CustomKeyboardAvoidingView from '../../../helpers/Views/CustomKeyboardAvoidingView';
import { CartNavStackParamList } from '../navigationHelpers';
import { StackScreenProps } from '@react-navigation/stack';
import { Optional } from '../../../helpers/general';
import { getRequestOrderItemsFromCartEntries, submitOrder } from '../../../api/orders/requests';
import { displayErrorMessage, displaySuccessMessage } from '../../../helpers/Alerts';
import { batch } from 'react-redux';
import AppSettings from '../../../settings';


const OrderConfirmationScreen = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        scrollView: {
            overflow: 'visible',
            zIndex: -1,
        },
        scrollViewContentContainer: {
            padding: LayoutConstants.pageSideInsets,
            paddingTop: LayoutConstants.floatingCellStyles.sectionSpacing,
        },
        scrollViewContentHolder: {
            maxWidth: LayoutConstants.floatingCellStyles.maxWidth,
            width: '100%',
            alignSelf: 'center',
        },
        submitButton: {
            maxWidth: LayoutConstants.bottomScreenButtonWithGradient.maxWidth,
            alignSelf: 'center',
            width: '100%',
        },
    });

    const OrderConfirmationScreen = (props: StackScreenProps<CartNavStackParamList, 'OrderingConfirmation'>) => {

        const [pickUpOrDelivery, _setPickUpOrDelivery] = useState<Optional<PickUpOrDelivery>>(null);
        const [howToPay, setHowToPay] = useState<Optional<HowToPay>>(null);

        const setPickUpOrDelivery = (pickUpOrDelivery: Optional<PickUpOrDelivery>) => {
            batch(() => {
                _setPickUpOrDelivery(pickUpOrDelivery);
                if (pickUpOrDelivery === PickUpOrDelivery.delivery){
                    setHowToPay(HowToPay.online);
                }
            });
        }

        const shouldBottomButtonBeEnabled = howToPay != null && pickUpOrDelivery != null;
        const [isSubmitting, setIsSubmitting] = useState(false);

        function onBottomButtonPressed(){
            setIsSubmitting(true);
            submitOrder({
                user_notes: null,
                user_paid_online: howToPay === HowToPay.online,
                user_wants_order_delivered: howToPay === HowToPay.inPerson,
                order_items: getRequestOrderItemsFromCartEntries(props.route.params.cartEntries),
            }).finally(() => {
                setIsSubmitting(false);
            }).then(() => {
                props.navigation.popToTop();
                displaySuccessMessage([
                    'Your order has been placed!!', 
                    'To see your order details, go to the "My Orders" page on the settings screen.',
                    ...(pickUpOrDelivery === PickUpOrDelivery.delivery ? [`Remember to give our delivery driver a call at ${AppSettings.deliveryDriverPhoneNumber}.`] : [])
                ].join('\n'));
            }).catch(error => {
                displayErrorMessage(error.message);
            });
        }

        return <CustomKeyboardAvoidingView style={styles.root}>
            <NavigationControllerNavigationBar title="Confirm Order" />            
                <ScrollView
                    style={styles.scrollView}
                    alwaysBounceVertical={true}
                    contentContainerStyle={styles.scrollViewContentContainer}
                >
                    <SpacerView style={styles.scrollViewContentHolder} space={LayoutConstants.floatingCellStyles.sectionSpacing}>
                        <FloatingCellStyleSectionView sectionTitle="Order Total">
                            <CartTotalSummaryView entries={props.route.params.cartEntries} />
                        </FloatingCellStyleSectionView>
                        <OrderConfirmationPickUpOrDeliveryView value={pickUpOrDelivery} onValueChange={setPickUpOrDelivery}/>
                        <OrderConfirmationHowToPayView value={howToPay} onValueChange={setHowToPay} payOnArrivalEnabled={pickUpOrDelivery !== PickUpOrDelivery.delivery}/>
                        <Space space={LayoutConstants.pageSideInsets} />
                        <LongTextAndIconButton
                            text="Submit Order"
                            iconSource={require('./icons/hotel.png')}
                            style={styles.submitButton}
                            isEnabled={shouldBottomButtonBeEnabled}
                            isLoading={isSubmitting}
                            onPress={onBottomButtonPressed}
                        />
                    </SpacerView>
                </ScrollView>
        </CustomKeyboardAvoidingView>
    }
    return OrderConfirmationScreen;
})();

export default OrderConfirmationScreen;



