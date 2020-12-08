

import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, Animated, TextInput, Platform } from 'react-native';
import LayoutConstants from '../../../LayoutConstants';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import Spacer from '../../../helpers/Spacers/Spacer';
import { TextFieldView, TextFieldViewProps } from '../../../helpers/Views/TextFieldView';
import Parser, { CustomParsers } from '../../../helpers/Parser';
import { Optional } from '../../../helpers/general';
import { batch } from 'react-redux';



function formatCreditCardNumber(string: string): string{
    const digitParser = CustomParsers.digit.ignoreNulls();
    
    const cardNumberGroupParser = new Parser(input => {
        let leftoverString = input;
        let group = "";
        while (group.length < 4 && leftoverString.length > 0){
            const next = digitParser.parse(leftoverString);
            if (next){
                leftoverString = next.leftover;
                group += next.result;
            } else {
                break;
            }
        }
        if (group.length === 0){
            return null;
        } else {
            return {
                leftover: leftoverString,
                result: group,
            }
        }
    });

    return (cardNumberGroupParser.many(4).parse(string)?.result ?? []).join(" ") ?? "";

}

function formatExpirationDate(string: string): string{
    const digitParser = CustomParsers.digit.ignoreNulls();

    const monthParser = digitParser.many(2).map(x => x.join(''));
    const yearParser = digitParser.many(4).map(x => x.join(''));

    const fullDateParser = monthParser.then(yearParser, true);
    const result = fullDateParser.parse(string);

    return (result?.result.filter(x => x != null) ?? []).join(" / ");
}

function formatCVVCode(string: string){
    const parser = CustomParsers.digit.ignoreNulls().many(4).map(x => x.join(''));
    return parser.parse(string)?.result ?? "";
}




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
                    textFormatter={formatCreditCardNumber}
                    onChangeText={value => {
                        setCreditCardNumber(value);
                    }}
                    placeholder={formatCreditCardNumber("4444 5555 6666 7777")}
                />
                <SpacerView space={10} style={styles.bottomRow}>
                    <NumberTextFieldView
                        style={[styles.bottomRowItem]}
                        topTitleText="Expiration"
                        value={expirationDate}
                        onChangeText={value => setExpirationDate(value)}
                        placeholder={formatExpirationDate("07/2030")}
                        textFormatter={formatExpirationDate}
                    />
                    <NumberTextFieldView
                        style={[styles.bottomRowItem]}
                        topTitleText="CVV"
                        value={CVV}
                        onChangeText={value => setCVV(value)}
                        placeholder={formatCVVCode("672")}
                        textFormatter={formatCVVCode}
                    />
                </SpacerView>
            </Spacer>
        </Animated.View>
    }
    return OrderConfirmationCardDetailsView;
})();

export default OrderConfirmationCardDetailsView;







interface NumberTextFieldViewProps extends TextFieldViewProps{
    textFormatter: (text: string) => string;
}


function NumberTextFieldView(props: NumberTextFieldViewProps){

    const [textFieldCursorPosition, setTextFieldCursorPosition] = useState<Optional<{position: number}>>(null);

    const cardTextFieldRef = useRef<TextInput>(null);
    const currentTextValue = useRef('');

    useEffect(() => {
        if (
            Platform.OS === 'web' && 
            typeof textFieldCursorPosition?.position === "number"
        ){
            (cardTextFieldRef.current as any)?.setSelectionRange(textFieldCursorPosition.position, textFieldCursorPosition.position);
        }
    }, [textFieldCursorPosition]);


    return <TextFieldView 
        {...props}
        textInputRef={cardTextFieldRef}
        onChangeText={value => {
            const newValue = props.textFormatter(value);
            batch(() => {
                if (Platform.OS === 'web'){
                    const newPosition = (() => {
                        const currentCursorPosition = (cardTextFieldRef.current as any)?.selectionEnd as number;
                        if (value.length > currentTextValue.current.length){
                            const characterTypedPosition = Math.max(currentCursorPosition - 1);
                            const characterTyped = value[characterTypedPosition];
                            const newCharacterPosition = newValue.indexOf(characterTyped, characterTypedPosition);
                            return newCharacterPosition === -1 ? newValue.length : newCharacterPosition + 1;
                        } else {
                            return currentCursorPosition;
                        }
                    })();
                    setTextFieldCursorPosition({position: newPosition});
                }
                props.onChangeText?.(newValue);
                currentTextValue.current = newValue;
            });
        }}
        textInputProps={{
            keyboardType: 'number-pad',
            ...props.textInputProps,
        }}
    />
}

