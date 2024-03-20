import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
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
import {
  getRequestOrderItemsFromCartEntries,
  submitOrder,
} from '../../../api/orders/requests';
import {
  displayErrorMessage,
  displaySuccessMessage,
} from '../../../helpers/Alerts';
import { Formik, useField, useFormikContext } from '../../../helpers/formik';
import {
  HowToPay,
  OrderConfirmationScreenContext,
  OrderConfirmationScreenContextValue,
  OrderConfirmationScreenValues,
  PickUpOrDelivery,
} from './helpers';
import * as yup from 'yup';
import { CartEntriesMapValue } from '../../../redux/cart';
import { FormikProps } from 'formik';
import AsyncStorage from '@react-native-community/async-storage';
import OrderConfirmationLayoutConstants from './OrderConfirmationLayoutConstants';
import { useSelector } from '../../../redux/store';
import { UserType } from '../../../api/authentication/validation';
import { isDigit } from '../../../helpers/general';

const OrderConfirmationScreen = (() => {
  const OrderConfirmationScreen = (
    props: StackScreenProps<CartNavStackParamList, 'OrderingConfirmation'>,
  ) => {
    const initialValues: OrderConfirmationScreenValues = useMemo(
      () => ({
        pickUpOrDelivery: null,
        howToPay: null,
        deliveryDirections: '',
        creditCardNumber: '',
        cardExpirationDate: '',
        cardCVV: '',
        cardFirstName: '',
        cardLastName: '',
      }),
      [],
    );

    const formikRef = useRef<FormikProps<OrderConfirmationScreenValues>>(null);

    useEffect(() => {
      AsyncStorage.getItem(
        OrderConfirmationLayoutConstants.cachedDeliveryDirectionsKey,
      ).then(prevDeliveryDirections => {
        if (prevDeliveryDirections != null) {
          const deliveryDirectionsKey: keyof OrderConfirmationScreenValues =
            'deliveryDirections';
          formikRef.current?.setFieldValue(
            deliveryDirectionsKey,
            prevDeliveryDirections,
          );
        }
      });
    }, []);

    const currentUserType = useSelector(
      state => state.authentication?.userObject.userType,
    );

    const contextValue: OrderConfirmationScreenContextValue = useMemo(() => {
      return {
        isOnlinePaymentAllowed: currentUserType === UserType.manager,
      };
    }, [currentUserType]);

    return (
      <OrderConfirmationScreenContext.Provider value={contextValue}>
        <Formik<OrderConfirmationScreenValues>
          innerRef={formikRef}
          validationSchema={() => {
            const requireIfPayingOnline = (
              initialSchema: yup.StringSchema<string | undefined, object>,
              fieldName: string,
            ) => {
              return initialSchema.when('howToPay', {
                is: HowToPay.online,
                then: yup.string().required(fieldName + ' is required'),
              });
            };

            return yup.object({
              pickUpOrDelivery: yup
                .string()
                .oneOf([PickUpOrDelivery.delivery, PickUpOrDelivery.pickUp])
                .required(),
              howToPay: yup
                .string()
                .oneOf([HowToPay.online, HowToPay.inPerson])
                .required(),
              deliveryDirections: yup
                .string()
                .trim()
                .when('pickUpOrDelivery', {
                  is: PickUpOrDelivery.delivery,
                  then: yup
                    .string()
                    .required('You must include delivery directions.'),
                }),
              creditCardNumber: requireIfPayingOnline(
                yup
                  .string()
                  .trim()
                  .matches(
                    /^\d{4} \d{4} \d{4} \d{1,4}$/,
                    'Credit Card Number should follow the format 4444 5555 6666 7777',
                  ),
                'Credit Card Number',
              ),
              cardExpirationDate: requireIfPayingOnline(
                yup
                  .string()
                  .trim()
                  .matches(
                    /^\d{2} \/ \d{2}$/,
                    'Expiration Date should follow the format MM/YY',
                  ),
                'Expiration Date',
              ),
              cardCVV: requireIfPayingOnline(
                yup
                  .string()
                  .trim()
                  .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 numbers long'),
                'CVV',
              ),
              cardFirstName: requireIfPayingOnline(
                yup.string().trim(),
                'First Name',
              ),
              cardLastName: requireIfPayingOnline(
                yup.string().trim(),
                'Last Name',
              ),
            });
          }}
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting }) => {
            const user_paid_online = values.howToPay === HowToPay.online;
            submitOrder({
              user_notes: null,
              order_items: getRequestOrderItemsFromCartEntries(
                props.route.params.cartEntries,
              ),
              ...(user_paid_online === true
                ? {
                    user_paid_online: true,
                    // credit_card_number: values.creditCardNumber.trim().replaceAll(' ', ''),
                    credit_card_number: '4111111111111111',
                    card_expiration_date: values.cardExpirationDate
                      .trim()
                      .replaceAll(' ', ''),
                    card_cvv: values.cardCVV.trim(),
                    card_first_name: values.cardFirstName.trim(),
                    card_last_name: values.cardLastName.trim(),
                    ...(values.pickUpOrDelivery === PickUpOrDelivery.delivery
                      ? {
                          user_wants_order_delivered: true,
                          delivery_directions: values.deliveryDirections.trim(),
                        }
                      : { user_wants_order_delivered: false }),
                  }
                : {
                    user_paid_online: false,
                    user_wants_order_delivered: false,
                  }),
            })
              .finally(() => {
                setSubmitting(false);
              })
              .then(() => {
                props.navigation.popToTop();
                displaySuccessMessage(
                  [
                    'Your order has been placed!!',
                    'To see your order details, go to the "My Orders" page on the settings screen.',
                  ].join('\n'),
                );
              })
              .catch(error => {
                displayErrorMessage(error.message);
              });
          }}
        >
          {formik => {
            if (formik.values.pickUpOrDelivery === PickUpOrDelivery.delivery) {
              const newValue = contextValue.isOnlinePaymentAllowed
                ? HowToPay.online
                : null;
              formik.values.howToPay !== newValue &&
                formik.setFieldValue('howToPay', newValue);
            }

            if (
              formik.values.howToPay === HowToPay.online &&
              contextValue.isOnlinePaymentAllowed === false
            ) {
              formik.setFieldValue('howToPay', null);
            }

            return (
              <OrderConfirmationScreenContent
                cartEntries={props.route.params.cartEntries}
              />
            );
          }}
        </Formik>
      </OrderConfirmationScreenContext.Provider>
    );
  };
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
  const OrderConfirmationScreenContent = (props: {
    cartEntries: CartEntriesMapValue[];
  }) => {
    return (
      <CustomKeyboardAvoidingView style={styles.root}>
        <NavigationControllerNavigationBar title="Confirm Order" />
        <ScrollView
          style={styles.scrollView}
          alwaysBounceVertical={true}
          contentContainerStyle={styles.scrollViewContentContainer}
        >
          <SpacerView
            style={styles.scrollViewContentHolder}
            space={LayoutConstants.floatingCellStyles.sectionSpacing}
          >
            <FloatingCellStyleSectionView sectionTitle="Order Total">
              <OrderConfirmationScreenCartTotalSummaryView
                cartEntries={props.cartEntries}
              />
            </FloatingCellStyleSectionView>
            <OrderConfirmationPickUpOrDeliveryView />
            <OrderConfirmationHowToPayView />
            <Space space={LayoutConstants.pageSideInsets} />
            <SubmitButton />
          </SpacerView>
        </ScrollView>
      </CustomKeyboardAvoidingView>
    );
  };
  return React.memo(OrderConfirmationScreenContent);
})();

const OrderConfirmationScreenCartTotalSummaryView = (props: {
  cartEntries: CartEntriesMapValue[];
}) => {
  const [, { value }] = useField<
    OrderConfirmationScreenValues,
    'pickUpOrDelivery'
  >('pickUpOrDelivery');
  return (
    <CartTotalSummaryView
      entries={props.cartEntries}
      includeDeliveryFee={value === PickUpOrDelivery.delivery}
    />
  );
};

const SubmitButton = (() => {
  const styles = StyleSheet.create({
    submitButton: {
      maxWidth: LayoutConstants.bottomScreenButtonWithGradient.maxWidth,
      alignSelf: 'center',
      width: '100%',
    },
  });

  const SubmitButton = () => {
    const formikContext = useFormikContext<OrderConfirmationScreenValues>();
    return (
      <LongTextAndIconButton
        text="Submit Order"
        iconSource={require('./icons/hotel_white.png')}
        style={styles.submitButton}
        isEnabled={formikContext.isValid && formikContext.dirty}
        isLoading={formikContext.isSubmitting}
        onPress={formikContext.submitForm}
      />
    );
  };
  return SubmitButton;
})();
