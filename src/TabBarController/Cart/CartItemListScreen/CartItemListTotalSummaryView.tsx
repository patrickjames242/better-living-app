import React from 'react';
import {View, StyleSheet} from 'react-native';
import LayoutConstants from '../../../LayoutConstants';
import { CustomColors } from '../../../helpers/colors';
import { CustomFont } from '../../../helpers/fonts/fonts';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import CustomizedText from '../../../helpers/CustomizedText';

export const CartItemListTotalSummaryView = (() => {

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
            fontSize: 21.5,
        },
        finalPriceText: {
            fontFamily: CustomFont.bold,
            fontSize: 28,
            marginBottom: -4,
        },

    });

    const CartItemListTotalSummaryView = () => {
        return <SpacerView style={styles.root} space={10}>
            <SpacerView style={styles.subtotalItemsBox} space={8}>
                <View style={styles.amountItemBox}>
                    <CustomizedText style={styles.subtotalItemText}>Subtotal:</CustomizedText>
                    <CustomizedText style={styles.subtotalItemText}>$10.47</CustomizedText>
                </View>
                <View style={styles.amountItemBox}>
                    <CustomizedText style={styles.subtotalItemText}>VAT:</CustomizedText>
                    <CustomizedText style={styles.subtotalItemText}>$1.53</CustomizedText>
                </View>
            </SpacerView>

            <View style={[styles.amountItemBox, styles.finalTotalHolderBox]}>
                <CustomizedText style={styles.finalTotalText}>Total:</CustomizedText>
                <CustomizedText style={styles.finalPriceText}>$11.24</CustomizedText>
            </View>
        </SpacerView>
    }
    return CartItemListTotalSummaryView;
})();

