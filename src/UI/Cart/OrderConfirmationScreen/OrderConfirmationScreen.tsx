
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import NavigationControllerNavigationBar from '../../../helpers/Views/NavigationControllerNavigationBar';
import FloatingCellStyleSectionView from '../../../helpers/Views/FloatingCellStyleSectionView';
import CartTotalSummaryView from '../CartItemListTotalSummaryView';
import LayoutConstants from '../../../LayoutConstants';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import OrderConfirmationPickUpOrDeliveryView from './OrderConfirmationPickUpOrDeliveryView';
import OrderConfirmationHowToPayView from './OrderConfirmationHowToPayView';
import LongTextAndIconButton from '../../../helpers/Buttons/LongTextAndIconButton';
import Space from '../../../helpers/Spacers/Space';
import { ScrollView } from 'react-native-gesture-handler';
import CustomKeyboardAvoidingView from '../../../helpers/Views/CustomKeyboardAvoidingView';
import { CartNavStackParamList } from '../navigationHelpers';
import { StackScreenProps } from '@react-navigation/stack';
import { getRequestOrderItemsFromCartEntries, submitOrder } from '../../../api/orders/requests';
import { displayErrorMessage, displaySuccessMessage } from '../../../helpers/Alerts';
import AppSettings from '../../../settings';
import { Formik } from '../../../helpers/formik';
import { HowToPay, OrderConfirmationScreenValues, PickUpOrDelivery } from './helpers';
import * as yup from 'yup';

const OrderConfirmationScreen = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        scrollView: {
            overflow: 'visible',
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

        const initialValues: OrderConfirmationScreenValues = useMemo(() => ({
            pickUpOrDelivery: '',
            howToPay: '',
            deliveryDirections: '',
        }), []);

        return <Formik<OrderConfirmationScreenValues>
            validationSchema={yup.object({
                pickUpOrDelivery: yup.string().oneOf([PickUpOrDelivery.delivery, PickUpOrDelivery.pickUp]).required(),
                howToPay: yup.string().oneOf([HowToPay.online, HowToPay.inPerson]).required(),
                deliveryDirections: yup.string().trim().when('pickUpOrDelivery', {
                    is: PickUpOrDelivery.delivery,
                    then: yup.string().required('You must include delivery directions.')
                }),
            })}
            initialValues={initialValues}
            onSubmit={(values, {setSubmitting}) => {
                submitOrder({
                    user_notes: null,
                    user_paid_online: values.howToPay === HowToPay.online,
                    order_items: getRequestOrderItemsFromCartEntries(props.route.params.cartEntries),
                    ...(values.pickUpOrDelivery === PickUpOrDelivery.delivery ?
                        { user_wants_order_delivered: true, delivery_directions: values.deliveryDirections } :
                        { user_wants_order_delivered: false }
                    )
                }).finally(() => {
                    setSubmitting(false);
                }).then(() => {
                    props.navigation.popToTop();
                    displaySuccessMessage([
                        'Your order has been placed!!',
                        'To see your order details, go to the "My Orders" page on the settings screen.',
                    ].join('\n'));
                }).catch(error => {
                    displayErrorMessage(error.message);
                });
            }}
        >{formik => {

            return <CustomKeyboardAvoidingView style={styles.root}>
                <NavigationControllerNavigationBar title="Confirm Order" />
                <ScrollView
                    style={styles.scrollView}
                    alwaysBounceVertical={true}
                    contentContainerStyle={styles.scrollViewContentContainer}
                >
                    <SpacerView style={styles.scrollViewContentHolder} space={LayoutConstants.floatingCellStyles.sectionSpacing}>
                        <FloatingCellStyleSectionView sectionTitle="Order Total">
                            <CartTotalSummaryView entries={props.route.params.cartEntries} includeDeliveryFee={formik.values.pickUpOrDelivery === PickUpOrDelivery.delivery} />
                        </FloatingCellStyleSectionView>
                        <OrderConfirmationPickUpOrDeliveryView />
                        <OrderConfirmationHowToPayView />
                        <Space space={LayoutConstants.pageSideInsets} />
                        <LongTextAndIconButton
                            text="Submit Order"
                            iconSource={require('./icons/hotel_white.png')}
                            style={styles.submitButton}
                            isEnabled={formik.isValid && formik.dirty}
                            isLoading={formik.isSubmitting}
                            onPress={formik.submitForm}
                        />
                    </SpacerView>
                </ScrollView>
            </CustomKeyboardAvoidingView>
        }}</Formik>

    }
    return OrderConfirmationScreen;
})();

export default OrderConfirmationScreen;



