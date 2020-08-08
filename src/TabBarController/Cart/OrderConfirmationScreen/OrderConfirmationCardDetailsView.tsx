

import React, { useState, useRef, useLayoutEffect } from 'react';
import { StyleSheet, Animated } from 'react-native';
import LayoutConstants from '../../../LayoutConstants';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import Spacer from '../../../helpers/Spacers/Spacer';
import TextFieldView, { TextFieldViewProps } from '../../../helpers/Views/TextFieldView';




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
                useNativeDriver: true,
            }).start();
        }, [currentDesiredOpacityValue, opacity]);

        return <Animated.View pointerEvents={props.isEnabled ? undefined : "none"} style={[styles.root, {
            opacity: opacity,
        }]}>
            <Spacer space={10}>
                <NumberTextFieldView
                    topTitleText="Credit Card Number"
                    value={creditCardNumber}
                    onValueChange={value => setCreditCardNumber(value)}
                    textInputProps={{
                        placeholder: "4444 5555 6666 7777"
                    }}
                />
                <SpacerView space={10} style={styles.bottomRow}>
                    <NumberTextFieldView
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
                    <NumberTextFieldView
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



function NumberTextFieldView(props: TextFieldViewProps){
    return <TextFieldView 
        {...props}
        textInputProps={{
            keyboardType: 'number-pad',
            ...props.textInputProps,
        }}
    />
}

