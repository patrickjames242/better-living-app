

import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, Animated, TextInput, Platform } from 'react-native';
import LayoutConstants from '../../../LayoutConstants';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import Spacer from '../../../helpers/Spacers/Spacer';
import { TextFieldView } from '../../../helpers/Views/TextFieldView';
import Parser, { CustomParsers } from '../../../helpers/Parser';
import { Optional } from '../../../helpers/general';
import { batch } from 'react-redux';
import { OrderConfirmationScreenValues } from './helpers';
import { FormikTextFieldView, FormikTextFieldViewProps } from '../../../helpers/Views/FormikTextFieldView';
import { useField } from '../../../helpers/formik';



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
    const yearParser = digitParser.many(2).map(x => x.join(''));

    const fullDateParser = monthParser.then(yearParser, true);
    const result = fullDateParser.parse(string);

    return (result?.result.filter(x => x != null) ?? []).join(" / ");
}

function formatCVVCode(string: string){
    const parser = CustomParsers.digit.ignoreNulls().many(4).map(x => x.join(''));
    return parser.parse(string)?.result ?? "";
}




export interface OrderConfirmationCardDetailsViewProps {
    isEnabled?: boolean,
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
        const [firstName, setFirstName] = useState('');
        const [lastName, setLastName] = useState('');

        const isEnabled = props.isEnabled ?? true;

        const currentDesiredOpacityValue = isEnabled ? 1 : 0.5;

        const opacity = useRef(new Animated.Value(currentDesiredOpacityValue)).current;

        useLayoutEffect(() => {
            Animated.timing(opacity, {
                duration: 150,
                toValue: currentDesiredOpacityValue,
                useNativeDriver: true,
            }).start();
        }, [currentDesiredOpacityValue, opacity]);

        


        return <Animated.View pointerEvents={isEnabled ? undefined : "none"} style={[styles.root, {
            opacity: opacity,
        }]}>
            <Spacer space={10}>
                <NumberTextFieldView
                    formikFieldName="creditCardNumber"
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
                        formikFieldName="cardExpirationDate"
                        style={[styles.bottomRowItem]}
                        topTitleText="Expiration"
                        value={expirationDate}
                        onChangeText={setExpirationDate}
                        placeholder={formatExpirationDate("07/24")}
                        textFormatter={formatExpirationDate}
                    />
                    <NumberTextFieldView
                        formikFieldName="cardCVV"
                        style={[styles.bottomRowItem]}
                        topTitleText="CVV"
                        value={CVV}
                        onChangeText={setCVV}
                        placeholder={formatCVVCode("672")}
                        textFormatter={formatCVVCode}
                    />
                </SpacerView>
                <SpacerView space={10} style={styles.bottomRow}>
                    <FormikTextFieldView<OrderConfirmationScreenValues>
                        formikFieldName="cardFirstName"
                        style={[styles.bottomRowItem]}
                        topTitleText="First Name"
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="John"
                    />
                    <FormikTextFieldView<OrderConfirmationScreenValues>
                        formikFieldName="cardLastName"
                        style={[styles.bottomRowItem]}
                        topTitleText="Last Name"
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Doe"
                    />
                </SpacerView>
            </Spacer>
        </Animated.View>
    }
    return OrderConfirmationCardDetailsView;
})();

export default OrderConfirmationCardDetailsView;







interface NumberTextFieldViewProps<Key extends keyof OrderConfirmationScreenValues> extends FormikTextFieldViewProps<Key>{
    textFormatter: (text: string) => string;
}


function NumberTextFieldView<Key extends keyof OrderConfirmationScreenValues>(props: NumberTextFieldViewProps<Key>){

    const [textFieldCursorPosition, setTextFieldCursorPosition] = useState<Optional<{position: number}>>(null);

    const cardTextFieldRef = useRef<TextInput>(null);
    const currentTextValue = useRef('');

    const [, { value, error, touched }, { setValue, setTouched }] = useField<OrderConfirmationScreenValues, Key>(props.formikFieldName);

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
        value={value as string}
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
                setValue(newValue as any);
                props.onChangeText?.(newValue);
                currentTextValue.current = newValue;
            });
        }}
        errorMessage={(touched && error) ? error : undefined}
        textInputProps={{
            keyboardType: 'number-pad',
            ...props.textInputProps,
            onBlur: (...args) => {
                setTouched(true);
                props.textInputProps?.onBlur?.(...args);
            }
        }}
    />
}

