
import React, { useEffect, useMemo, useRef } from 'react';
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
import { Formik, useField, useFormikContext } from '../../../helpers/formik';
import { HowToPay, OrderConfirmationScreenValues, PickUpOrDelivery } from './helpers';
import * as yup from 'yup';
import { CartEntriesMapValue } from '../../../redux/cart';
import { FormikProps } from 'formik';
import AsyncStorage from '@react-native-community/async-storage';
import OrderConfirmationLayoutConstants from './OrderConfirmationLayoutConstants';

const OrderConfirmationScreen = (() => {
    
    
    const OrderConfirmationScreen = (props: StackScreenProps<CartNavStackParamList, 'OrderingConfirmation'>) => {

        const initialValues: OrderConfirmationScreenValues = useMemo(() => ({
            pickUpOrDelivery: null,
            howToPay: null,
            deliveryDirections: '',
        }), []);

        const formikRef = useRef<FormikProps<OrderConfirmationScreenValues>>(null);

        useEffect(() => {
            AsyncStorage.getItem(OrderConfirmationLayoutConstants.cachedDeliveryDirectionsKey).then(prevDeliveryDirections => {
                if (prevDeliveryDirections != null){
                    const deliveryDirectionsKey: keyof OrderConfirmationScreenValues = "deliveryDirections";
                    formikRef.current?.setFieldValue(deliveryDirectionsKey, prevDeliveryDirections)
                }
            });
            
        }, []);

        return <Formik<OrderConfirmationScreenValues>
            innerRef={formikRef}
            validationSchema={yup.object({
                pickUpOrDelivery: yup.string().oneOf([PickUpOrDelivery.delivery, PickUpOrDelivery.pickUp]).required(),
                howToPay: yup.string().oneOf([HowToPay.online, HowToPay.inPerson]).required(),
                deliveryDirections: yup.string().trim().when('pickUpOrDelivery', {
                    is: PickUpOrDelivery.delivery,
                    then: yup.string().required('You must include delivery directions.')
                }),
            })}
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting }) => {
                submitOrder({
                    user_notes: null,
                    user_paid_online: values.howToPay === HowToPay.online,
                    order_items: getRequestOrderItemsFromCartEntries(props.route.params.cartEntries),
                    ...(values.pickUpOrDelivery === PickUpOrDelivery.delivery ?
                        { user_wants_order_delivered: true, delivery_directions: values.deliveryDirections.trim() } :
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
        >
            <OrderConfirmationScreenContent cartEntries={props.route.params.cartEntries} />
        </Formik>

    }
    return OrderConfirmationScreen;
})();

export default OrderConfirmationScreen;




const OrderConfirmationScreenContent = (() => {

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
    });
    const OrderConfirmationScreenContent = (props: { cartEntries: CartEntriesMapValue[] }) => {
        return <CustomKeyboardAvoidingView style={styles.root}>
            <NavigationControllerNavigationBar title="Confirm Order" />
            <ScrollView
                style={styles.scrollView}
                alwaysBounceVertical={true}
                contentContainerStyle={styles.scrollViewContentContainer}
            >
                <SpacerView style={styles.scrollViewContentHolder} space={LayoutConstants.floatingCellStyles.sectionSpacing}>
                    <FloatingCellStyleSectionView sectionTitle="Order Total">
                        <OrderConfirmationScreenCartTotalSummaryView cartEntries={props.cartEntries} />
                    </FloatingCellStyleSectionView>
                    <OrderConfirmationPickUpOrDeliveryView />
                    <OrderConfirmationHowToPayView />
                    <Space space={LayoutConstants.pageSideInsets} />
                    <SubmitButton />
                </SpacerView>
            </ScrollView>
        </CustomKeyboardAvoidingView>
    }
    return React.memo(OrderConfirmationScreenContent);
})();




const OrderConfirmationScreenCartTotalSummaryView = (props: { cartEntries: CartEntriesMapValue[] }) => {
    const [,{value}] = useField<OrderConfirmationScreenValues, 'pickUpOrDelivery'>('pickUpOrDelivery');
    return <CartTotalSummaryView entries={props.cartEntries} includeDeliveryFee={value === PickUpOrDelivery.delivery} />
}

const SubmitButton = (() => {

    const styles = StyleSheet.create({
        submitButton: {
            maxWidth: LayoutConstants.bottomScreenButtonWithGradient.maxWidth,
            alignSelf: 'center',
            width: '100%',
        },
    })

    const SubmitButton = () => {
        const formikContext = useFormikContext<OrderConfirmationScreenValues>();
        return <LongTextAndIconButton
            text="Submit Order"
            iconSource={require('./icons/hotel_white.png')}
            style={styles.submitButton}
            isEnabled={formikContext.isValid && formikContext.dirty}
            isLoading={formikContext.isSubmitting}
            onPress={formikContext.submitForm}
        />
    }
    return SubmitButton;
})();



