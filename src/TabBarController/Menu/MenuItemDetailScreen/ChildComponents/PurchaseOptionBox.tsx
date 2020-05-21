

import React from 'react';
import {StyleSheet} from 'react-native';
import { getShadowStyle } from '../../../../helpers/general';
import { CustomColors, Color } from '../../../../helpers/colors';
import { CustomFont } from '../../../../helpers/fonts/fonts';
import SpacerView from '../../../../helpers/Spacers/SpacerView';
import CustomizedText from '../../../../helpers/CustomizedText';
import BouncyButton from '../../../../helpers/BouncyButton';




const PurchaseOptionBox = (() => {

    const styles = StyleSheet.create({
        root: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 15,
            backgroundColor: 'white',
            borderRadius: 10,
            ...getShadowStyle(15),
        },
        leftSide: {

        },
        priceText: {
            color: CustomColors.themeGreen.stringValue,
            fontSize: 20,
            fontFamily: CustomFont.bold,
        },
        titleText: {
            fontSize: 15,
            fontFamily: CustomFont.medium,
            color: Color.gray(0.4).stringValue,
        },
        purchaseButton: {
            backgroundColor: CustomColors.themeGreen.stringValue,
            padding: 15,
            paddingTop: 10,
            paddingBottom: 10,
            borderRadius: 1000,
        },
        purchaseButtonText: {
            color: 'white',
            fontSize: 13,
            fontFamily: CustomFont.medium,
        },
    });

    return function PurchaseOptionBox(props: { price: string, title: string, buttonText: string}) {
        return <SpacerView space={20} style={styles.root}>
            <SpacerView space={5} style={styles.leftSide}>
                <CustomizedText style={styles.priceText}>{props.price}</CustomizedText>
                <CustomizedText style={styles.titleText}>{props.title}</CustomizedText>
            </SpacerView>
            <BouncyButton style={styles.purchaseButton} bounceScaleValue={0.8}>
                <CustomizedText style={styles.purchaseButtonText}>{props.buttonText}</CustomizedText>
            </BouncyButton>
        </SpacerView>
    }

})();

export default PurchaseOptionBox;
