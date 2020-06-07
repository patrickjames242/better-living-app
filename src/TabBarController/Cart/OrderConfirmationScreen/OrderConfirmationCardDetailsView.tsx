

import React, { useState, useRef, useLayoutEffect } from 'react';
import { StyleSheet, TextInput, TextInputProps, ViewProps, Animated } from 'react-native';
import LayoutConstants from '../../../LayoutConstants';
import OrderConfirmationLayoutConstants from './OrderConfirmationLayoutConstants';
import { CustomColors } from '../../../helpers/colors';
import CustomizedText from '../../../helpers/CustomizedText';
import { CustomFont } from '../../../helpers/fonts/fonts';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import Spacer from '../../../helpers/Spacers/Spacer';




export interface OrderConfirmationCardDetailsViewProps {
    isEnabled: boolean,
}

const OrderConfirmationCardDetailsView = (() => {

    const styles = StyleSheet.create({
        root: {
            padding: LayoutConstants.floatingCellStyles.padding,
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            backgroundColor: 'white',
        },
        bottomRow: {
            flexDirection: 'row',
        },
        bottomRowItem: {
            flex: 1,
        }
    });


    // interface PendingExpirationDate{
    //     month: Optional<number>,
    //     year: Optional<number>,
    //     rawString: string,
    // }

    // const monthsInAYear = 12;

    // function parseExpirationDate(text: string): PendingExpirationDate{
    //     function appendDigit(oldNumber: number, digit: number) {
    //         return oldNumber * 10 + digit
    //     }
    //     let month: Optional<number> = null;
    //     let year: Optional<number> = null;
    //     let rawString = '';
    //     for (let x = 0; x < text.length; x++) {
    //         const item = text[x];
    //         if (isDigit(item) === false) { continue; }
    //         const digit = parseInt(item);
    //         if (month == null || (appendDigit(month, digit) <= monthsInAYear)) {
    //             month = appendDigit(month ?? 0, digit);
    //             rawString += digit;
    //         } else if (year == null || appendDigit(year, digit) <= 99) {
    //             year = appendDigit(year ?? 0, digit);
    //             rawString += digit;
    //         } else { break; }
    //     }
    //     return { month, year, rawString }
    // }

    // function getDisplayStringForExpirationDate(date: PendingExpirationDate): string{
    //     if (date.month == null){ return ''; }
    //     let displayString = '';
    //     if (date.month > Math.floor(monthsInAYear / 10)) {
    //         (date.month < 10) && (displayString += '0'); 
    //         displayString += date.month + ' / ';
    //     } else {
    //         displayString += "0";
    //     }
    //     (date.year != null) && (displayString += date.year);
    //     return displayString;
    // }




    const OrderConfirmationCardDetailsView = (props: OrderConfirmationCardDetailsViewProps) => {

        const [creditCardNumber, setCreditCardNumber] = useState('');
        // const [expirationDate, setExpirationDate] = useState<PendingExpirationDate>({
        //     month: null, year: null, rawString: '',
        // });
        const [expirationDate, setExpirationDate] = useState('');
        const [CVV, setCVV] = useState('');

        const currentDesiredOpacityValue = props.isEnabled ? 1 : 0.5;

        const opacity = useRef(new Animated.Value(currentDesiredOpacityValue)).current;

        useLayoutEffect(() => {
            Animated.timing(opacity, {
                duration: 150,
                toValue: currentDesiredOpacityValue,
            }).start();
        }, [currentDesiredOpacityValue, opacity]);

        return <Animated.View pointerEvents={props.isEnabled ? undefined : "none"} style={[styles.root, {
            opacity: opacity,
        }]}>
            <Spacer space={10}>
                <TextFieldView
                    topTitleText="Credit Card Number"
                    value={creditCardNumber}
                    onValueChange={value => setCreditCardNumber(value)}
                    textInputProps={{
                        placeholder: "4444 5555 6666 7777"
                    }}
                />
                <SpacerView space={10} style={styles.bottomRow}>
                    <TextFieldView
                        style={[styles.bottomRowItem]}
                        topTitleText="Expiration"
                        // value={getDisplayStringForExpirationDate(expirationDate)}
                        // onValueChange={value => setExpirationDate(parseExpirationDate(value))}
                        value={expirationDate}
                        onValueChange={value => setExpirationDate(value)}
                        textInputProps={{
                            placeholder: "07/20"
                        }}
                    />
                    <TextFieldView
                        style={[styles.bottomRowItem]}
                        topTitleText="CVV"
                        value={CVV}
                        onValueChange={value => setCVV(value)}
                        textInputProps={{
                            placeholder: "672"
                        }}
                    />
                </SpacerView>
            </Spacer>
        </Animated.View>
    }
    return OrderConfirmationCardDetailsView;
})();

export default OrderConfirmationCardDetailsView;










interface TextFieldViewProps extends ViewProps {
    topTitleText: string;
    value: string;
    onValueChange: (newValue: string) => void;
    textInputProps: Omit<TextInputProps, 'value' | 'onChange' | 'onFocus' | 'onBlur' | 'selectionColor'>
}

const TextFieldView = (() => {

    const styles = StyleSheet.create({
        root: {

        },
        topTitleText: {
            marginLeft: LayoutConstants.floatingCellStyles.padding * 0.5,
            color: CustomColors.offBlackTitle.stringValue,
            fontFamily: CustomFont.medium
        },
        textInput: {
            borderWidth: OrderConfirmationLayoutConstants.selectionOutline.width,
            borderRadius: 10,
            padding: 10,
            fontSize: 16,
            color: CustomColors.offBlackTitle.stringValue,
        },
    });

    const TextFieldView = (props: TextFieldViewProps) => {

        const [isActive, setIsActive] = useState(false);

        return <SpacerView
            {...props}
            style={[styles.root, props.style]}
            space={10}
        >
            <CustomizedText style={styles.topTitleText}>{props.topTitleText}</CustomizedText>
            <TextInput
                keyboardType="number-pad"
                returnKeyType="done"
                {...props.textInputProps}
                style={[styles.textInput, {
                    borderColor: isActive ? OrderConfirmationLayoutConstants.selectionOutline.color.selected : OrderConfirmationLayoutConstants.selectionOutline.color.unselected,
                }]}
                onFocus={() => setIsActive(true)}
                onBlur={() => setIsActive(false)}
                value={props.value}
                onChange={event => props.onValueChange(event.nativeEvent.text)}
                selectionColor={CustomColors.themeGreen.stringValue}
            />
        </SpacerView>
    }
    return TextFieldView;
})();



