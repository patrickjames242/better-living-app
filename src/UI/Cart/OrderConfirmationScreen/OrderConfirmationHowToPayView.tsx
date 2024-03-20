import React, { useContext } from 'react';
import { Platform, StyleSheet } from 'react-native';
import FloatingCellStyleSectionView from '../../../helpers/Views/FloatingCellStyleSectionView';
import Spacer from '../../../helpers/Spacers/Spacer';
import OrderConfirmationLayoutConstants from './OrderConfirmationLayoutConstants';
import OrderConfirmationSelectableOptionView from './OrderConfirmationSelectableOptionView';
import OrderConfirmationCardDetailsView from './OrderConfirmationCardDetailsView';
import {
  HowToPay,
  OrderConfirmationScreenContext,
  OrderConfirmationScreenValues,
  PickUpOrDelivery,
} from './helpers';
import { useFormikContext } from '../../../helpers/formik';

export interface OrderConfirmationHowToPayViewProps {}

const OrderConfirmationHowToPayView = (() => {
  const styles = StyleSheet.create({
    root: {},
  });

  const OrderConfirmationHowToPayView = (
    props: OrderConfirmationHowToPayViewProps,
  ) => {
    const formikContext = useFormikContext<OrderConfirmationScreenValues>();

    const orderConfirmationScreenContext = useContext(
      OrderConfirmationScreenContext,
    );

    const payOnArrivalIsEnabled =
      formikContext.values.pickUpOrDelivery !== PickUpOrDelivery.delivery;
    const payOnlineIsEnabled =
      orderConfirmationScreenContext.isOnlinePaymentAllowed;

    return (
      <FloatingCellStyleSectionView
        sectionTitle="Pay In Person or Online"
        style={styles.root}
      >
        <Spacer
          space={OrderConfirmationLayoutConstants.selectableOptionViewSpacing}
        >
          <OrderConfirmationSelectableOptionView
            imageSource={require('./icons/buy.png')}
            title="Pay on arrival (in person)"
            isSelected={formikContext.values.howToPay === HowToPay.inPerson}
            onCheckMarkPressed={() =>
              formikContext.setFieldValue('howToPay', HowToPay.inPerson)
            }
            isEnabled={payOnArrivalIsEnabled}
            errorMessage={
              payOnArrivalIsEnabled === false
                ? 'Payment in person is not allowed for deliveries. Please pay online.'
                : undefined
            }
          />
          <OrderConfirmationSelectableOptionView
            imageSource={require('./icons/pay.png')}
            title="Pay online"
            isSelected={formikContext.values.howToPay === HowToPay.online}
            onCheckMarkPressed={() =>
              formikContext.setFieldValue('howToPay', HowToPay.online)
            }
            isEnabled={payOnlineIsEnabled}
            // yes, I know there are two spaces after each emoji on the web. That was intentional! Please leave them there!! without two spaces, things look weird on the web.
            errorMessage={
              payOnlineIsEnabled === false
                ? Platform.select({
                    web: 'Online payment is not available at this time 😞  . But it will be available soon 😆  !!',
                    default:
                      'Online payment is not available at this time 😞 . But it will be available soon 😆 !!',
                  })
                : 'Please note that online payment is not set up with the bank yet, so any card information entered will not be used.\n\n Also, only managers are able to use this online payment option as of now. For customers and employees this option is disabled.'
            }
          />
          {formikContext.values.howToPay === HowToPay.online && (
            <OrderConfirmationCardDetailsView />
          )}
        </Spacer>
      </FloatingCellStyleSectionView>
    );
  };
  return OrderConfirmationHowToPayView;
})();

export default OrderConfirmationHowToPayView;
