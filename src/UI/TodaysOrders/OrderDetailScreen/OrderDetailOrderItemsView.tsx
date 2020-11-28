import React from 'react';
import {StyleSheet, View} from 'react-native';
import Order from '../../../api/orders/Order';
import { Color } from '../../../helpers/colors';
import { CustomFont } from '../../../helpers/fonts/fonts';
import Space from '../../../helpers/Spacers/Space';
import Spacer from '../../../helpers/Spacers/Spacer';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import { OrderDetailScreenConstants } from './helpers';
import OrderDetailTitleContainer from './OrderDetailTitleContainer';
import currency from 'currency.js';
interface OrderItemsViewProps {
    orderDetailsJson: Order['detailsJson'];
}

const OrderItemsView = (() => {

    const styles = StyleSheet.create({
        root: {

        },
        segmentView: {
            flexDirection: 'row',
        },
        segmentLeftText: {
            fontSize: OrderDetailScreenConstants.regularFontSize,
            fontFamily: CustomFont.medium,
            color: OrderDetailScreenConstants.titleColor,
            marginRight: 10,
        },
        segmentCenter: {
            flex: 1,
        },
        segmentTitleLabel: {
            fontSize: OrderDetailScreenConstants.regularFontSize,
            fontFamily: CustomFont.medium,
            color: OrderDetailScreenConstants.titleColor,
        },
        segmentSubtitleLabel: {
            fontSize: 14,
            color: OrderDetailScreenConstants.subtitleColor,
            marginTop: 4,
        },
        segmentMealChoiceView: {
            marginLeft: 15
        },
        segmentMealChoiceCategoryText: {
            fontFamily: CustomFont.medium,
            fontSize: 15,
        },
        segmentMealChoiceProductTitle: {
            fontSize: 15,
            color: Color.gray(0.4).stringValue,
        },
        segmentPriceLabel: {
            fontSize: OrderDetailScreenConstants.regularFontSize,
        }
    });

    const SegmentView = (props: { item: Order['detailsJson'][0] }) => {

        const individualPrice = (() => {
            if (props.item.entry_type === 'product') {
                return props.item.product_price;
            } else {
                return props.item.meal_price;
            }
        })();

        const title = (() => {
            if (props.item.entry_type === 'product') {
                return props.item.product_name;
            } else {
                return props.item.meal_name;
            }
        })();

        return <View style={styles.segmentView}>
            <CustomizedText style={styles.segmentLeftText}>#</CustomizedText>
            <View style={styles.segmentCenter}>
                <CustomizedText style={styles.segmentTitleLabel}>
                    {title + (() => {
                        if (props.item.quantity > 1) return ' × ' + props.item.quantity
                        else return '';
                    })()}
                </CustomizedText>
                {props.item.quantity >= 2 && <CustomizedText style={styles.segmentSubtitleLabel}>{
                    props.item.quantity + ' × ' + currency(individualPrice).format()
                }</CustomizedText>}
                {props.item.entry_type === 'meal' && props.item.choices.length >= 1 && <>
                    <Space space={10} />
                    {/* eslint-disable-next-line react/no-children-prop */}
                    <Spacer space={15} children={
                        props.item.choices.map((x, index) => {
                            return <View key={index} style={styles.segmentMealChoiceView}>
                                <CustomizedText style={styles.segmentMealChoiceCategoryText}>{x.category_name + ":"}</CustomizedText>
                                <CustomizedText style={styles.segmentMealChoiceProductTitle}>{x.chosen_product_name}</CustomizedText>
                            </View>
                        })
                    } />
                </>}
            </View>
            <CustomizedText style={styles.segmentPriceLabel}>{currency(individualPrice * props.item.quantity).format()}</CustomizedText>
        </View>
    }

    const OrderItemsView = (props: OrderItemsViewProps) => {
        return <OrderDetailTitleContainer title="Order Items">
            {/* eslint-disable-next-line react/no-children-prop */}
            <Spacer space={17} children={
                props.orderDetailsJson.map((x, index) => <SegmentView key={index} item={x} />)
            } />
        </OrderDetailTitleContainer>
    }
    return React.memo(OrderItemsView);
})();

export default OrderItemsView;
