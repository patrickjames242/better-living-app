import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Order from '../../../api/orders/Order';
import { CustomFont } from '../../../helpers/fonts/fonts';
import Space from '../../../helpers/Spacers/Space';
import Spacer from '../../../helpers/Spacers/Spacer';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import { OrderDetailScreenConstants } from './helpers';
import OrderDetailTitleContainer from './OrderDetailTitleContainer';
import currency from 'currency.js';
import { useCalculatedPriceInfoForOrder } from '../../../api/orders/helpers';

interface OrderSubtotalsViewProps {
  order: Order;
}

const OrderSubtotalsView = (() => {
  const styles = StyleSheet.create({
    root: {},
    segmentView: {
      flexDirection: 'row',
    },
    segmentViewTitle: {
      // fontFamily: CustomFont.medium,
      fontSize: OrderDetailScreenConstants.regularFontSize,
    },
    segmentViewTitleIsTotal: {
      fontFamily: CustomFont.bold,
    },
    segmentViewValue: {
      fontSize: OrderDetailScreenConstants.regularFontSize,
      flex: 1,
      textAlign: 'right',
    },
    segmentViewValueIsTotal: {
      fontFamily: CustomFont.bold,
    },
  });

  const SegmentView = (props: {
    title: string;
    value: string;
    isTotal?: boolean;
  }) => {
    return (
      <View style={styles.segmentView}>
        <CustomizedText
          style={[
            styles.segmentViewTitle,
            props.isTotal ? styles.segmentViewTitleIsTotal : undefined,
          ]}
        >
          {props.title}
        </CustomizedText>
        <Space space={5} />
        <CustomizedText
          style={[
            styles.segmentViewValue,
            props.isTotal ? styles.segmentViewValueIsTotal : undefined,
          ]}
        >
          {props.value}
        </CustomizedText>
      </View>
    );
  };

  const OrderSubtotalsView = (props: OrderSubtotalsViewProps) => {
    const priceInfo = useCalculatedPriceInfoForOrder(props.order);

    return (
      <OrderDetailTitleContainer>
        <Spacer space={10}>
          {priceInfo.deliveryFee && priceInfo.deliveryFee > 0 && (
            <SegmentView
              title="Delivery Fee"
              value={currency(priceInfo.deliveryFee).format()}
            />
          )}
          <SegmentView
            title="Subtotal"
            value={currency(priceInfo.subtotal).format()}
          />
          <SegmentView title="VAT" value={currency(priceInfo.vat).format()} />
          <SegmentView
            title="Total"
            value={currency(priceInfo.total).format()}
            isTotal
          />
        </Spacer>
      </OrderDetailTitleContainer>
    );
  };
  return OrderSubtotalsView;
})();

export default OrderSubtotalsView;
