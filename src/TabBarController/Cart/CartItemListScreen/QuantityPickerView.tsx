import React from 'react';
import { StyleSheet, View} from 'react-native';
import { Color } from '../../../helpers/colors';
import { CustomFont } from '../../../helpers/fonts/fonts';
import { BaseSpacer } from '../../../helpers/Spacers/Spacer';
import HighlightButton from '../../../helpers/Buttons/HighlightView';
import CustomizedText from '../../../helpers/CustomizedText';


export interface QuantityPickerViewProps {
    value: number,
    increment: () => void,
    decrement: () => void,
}

const QuantityPickerView = (() => {

    const buttonSize = 35;

    const styles = StyleSheet.create({
        root: {
            borderRadius: 7,
            flexDirection: 'row',
            overflow: 'hidden',
            backgroundColor: Color.gray(0.95).stringValue,
        },
        buttons: {
            height: buttonSize * 0.9,
            width: buttonSize,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonText: {
            fontFamily: CustomFont.medium,
            fontSize: 18,
            color: Color.gray(0.4).stringValue,
        },
        centerLabelHolder: {
            minWidth: buttonSize,
            paddingLeft: 10,
            paddingRight: 10,
            alignItems: 'center',
            justifyContent: 'center',
        },
        centerLabel: {
            fontFamily: CustomFont.medium,
            fontSize: 15,
            color: Color.gray(0.4).stringValue,
        },
        separatorLine: {
            width: 1,
            backgroundColor: Color.gray(0.9).stringValue,
            marginTop: 6,
            marginBottom: 6,
        },
    });

    const hitSlop = 15;
    const hitSlopObj = {
        left: hitSlop, right: hitSlop, top: hitSlop, bottom: hitSlop,
    }

    const QuantityPickerView = (props: QuantityPickerViewProps) => {
        return <View style={styles.root} hitSlop={hitSlopObj}>
            <BaseSpacer renderSpacer={() => <View style={styles.separatorLine}/>}>
                <HighlightButton style={[styles.buttons]} onPress={props.decrement} hitSlop={hitSlopObj}>
                    <CustomizedText style={styles.buttonText}>-</CustomizedText>
                </HighlightButton>
                <View style={styles.centerLabelHolder} pointerEvents="none">
                    <CustomizedText style={styles.centerLabel}>{props.value}</CustomizedText>
                </View>
                <HighlightButton style={[styles.buttons]} onPress={props.increment} hitSlop={hitSlopObj}>
                    <CustomizedText style={styles.buttonText}>+</CustomizedText>
                </HighlightButton>
            </BaseSpacer>
        </View>
    }
    return QuantityPickerView;
})();


export default QuantityPickerView;



