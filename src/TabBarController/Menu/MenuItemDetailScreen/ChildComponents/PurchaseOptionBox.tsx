

import React from 'react';
import {StyleSheet} from 'react-native';
import { CustomColors, Color } from '../../../../helpers/colors';
import { CustomFont } from '../../../../helpers/fonts/fonts';
import SpacerView from '../../../../helpers/Spacers/SpacerView';
import CustomizedText from '../../../../helpers/CustomizedText';
import RoundedTextBouncyButton from '../../../../helpers/Buttons/RoundedTextBouncyButton';
import LayoutConstants from '../../../../LayoutConstants';


const PurchaseOptionBox = (() => {

    const styles = StyleSheet.create({
        root: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 15,
            backgroundColor: 'white',
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            ...LayoutConstants.floatingCellStyles.shadowConfig,
        },
        leftSide: {
            flexShrink: 1,
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
    });

    return function PurchaseOptionBox(props: { price: string, title: string, buttonText: string, onButtonPress?: () => void}) {
        return <SpacerView space={20} style={styles.root}>
            <SpacerView space={5} style={styles.leftSide}>
                <CustomizedText style={styles.priceText}>{props.price}</CustomizedText>
                <CustomizedText style={styles.titleText}>{props.title}</CustomizedText>
            </SpacerView>
            <RoundedTextBouncyButton text={props.buttonText} onPress={props.onButtonPress}/>
        </SpacerView>
    }

})();

export default PurchaseOptionBox;

