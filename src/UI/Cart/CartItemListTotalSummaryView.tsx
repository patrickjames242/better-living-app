

import React, { useMemo } from 'react';
import {View, StyleSheet} from 'react-native';
import LayoutConstants from '../../LayoutConstants';
import { CustomColors } from '../../helpers/colors';
import { CustomFont } from '../../helpers/fonts/fonts';
import SpacerView from '../../helpers/Spacers/SpacerView';
import CustomizedText from '../../helpers/Views/CustomizedText';
import { CartEntriesMapValue } from '../../redux/cart';
import { useSelector } from '../../redux/store';
import { CartProductEntry } from '../../api/cart/CartProductEntry';
import AppSettings from '../../settings';
import currency from 'currency.js';

export interface CartTotalSummaryViewProps{
    entries: CartEntriesMapValue[];
}

const CartTotalSummaryView = (() => {

    let rootPadding = LayoutConstants.floatingCellStyles.padding;
    let finalTotalSidePadding = 13;

    const styles = StyleSheet.create({
        root: {
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            padding: rootPadding,
            backgroundColor: 'white',
        },
        amountItemBox: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        subtotalItemText: {
            color: CustomColors.offBlackSubtitle.stringValue,
            fontFamily: CustomFont.medium,
            fontSize: 17,
        },
        subtotalItemsBox: {
            paddingLeft: finalTotalSidePadding * 0.7,
            paddingRight: finalTotalSidePadding * 0.7,
        },
        finalTotalHolderBox: {
            padding: 10,
            paddingLeft: finalTotalSidePadding,
            paddingRight: finalTotalSidePadding,
            backgroundColor: CustomColors.mainBackgroundColor.withAdjustedOpacity(0.8).stringValue,
            borderRadius: 8,
        },
        finalTotalText: {
            fontFamily: CustomFont.bold,
            fontSize: 21,
        },
        finalPriceText: {
            fontFamily: CustomFont.bold,
            fontSize: 21,
            marginBottom: -4,
        },
    });

    const CartTotalSummaryView = (props: CartTotalSummaryViewProps) => {

        const allProductsReduxState = useSelector(state => state.orderingSystem.products);
        const allMealsReduxState = useSelector(state => state.orderingSystem.meals);

        const subtotal = useMemo(() => {
            return props.entries.reduce<currency>((pv, cv) => {
                const currentValuePrice = (() => {

                    const quantity = (() => {
                        if (cv.pendingQuantityChangesInfo){
                            return currency(cv.pendingQuantityChangesInfo.originalQuantity).add(cv.pendingQuantityChangesInfo.pendingChange);
                        } else {
                            return currency(cv.entry.quantity);
                        }
                    })();

                    if (cv.entry instanceof CartProductEntry){
                        const product = allProductsReduxState.get(cv.entry.productId);
                        if (!product) return currency(0);
                        const price = currency(product.shouldBeSoldIndividually ? (product.individualPrice ?? 0) : 0);
                        return price.multiply(quantity);
                    } else {
                        const meal = allMealsReduxState.get(cv.entry.mealId);
                        if (!meal) return currency(0);
                        return currency(meal.price).multiply(quantity);
                    }
                })();
                return pv.add(currentValuePrice);
            }, currency(0));
        }, [allMealsReduxState, allProductsReduxState, props.entries]);

        const vatAmount = useMemo(() => {
            return subtotal.multiply(AppSettings.vatPercentage);
        }, [subtotal]);

        const finalTotal = useMemo(() => {
            return subtotal.add(vatAmount);
        }, [subtotal, vatAmount]);

        return <SpacerView style={styles.root} space={10}>
            <SpacerView style={styles.subtotalItemsBox} space={8}>
                <View style={styles.amountItemBox}>
                    <CustomizedText style={styles.subtotalItemText}>Subtotal:</CustomizedText>
                    <CustomizedText style={styles.subtotalItemText}>{subtotal.format()}</CustomizedText>
                </View>
                <View style={styles.amountItemBox}>
                    <CustomizedText style={styles.subtotalItemText}>VAT:</CustomizedText>
                    <CustomizedText style={styles.subtotalItemText}>{vatAmount.format()}</CustomizedText>
                </View>
            </SpacerView>
            <View style={[styles.amountItemBox, styles.finalTotalHolderBox]}>
                <CustomizedText style={styles.finalTotalText}>Total:</CustomizedText>
                <CustomizedText style={styles.finalPriceText}>{finalTotal.format()}</CustomizedText>
            </View>
        </SpacerView>
    }
    return CartTotalSummaryView;
})();

export default CartTotalSummaryView;