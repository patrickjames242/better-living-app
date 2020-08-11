
import React, { useState } from 'react';
import { ViewProps, TextInputProps, StyleSheet, TextInput, Platform } from 'react-native';
import LayoutConstants from '../../LayoutConstants';
import { CustomColors, Color } from '../colors';
import { CustomFont } from '../fonts/fonts';
import OrderConfirmationLayoutConstants from '../../TabBarController/Cart/OrderConfirmationScreen/OrderConfirmationLayoutConstants';
import SpacerView from '../Spacers/SpacerView';
import CustomizedText from './CustomizedText';

export const TextFieldViewConstants = {
    borderRadius: 10,
}



export interface TextFieldViewProps extends TextFieldViewContainerProps, TextFieldTextInputProps {

}

export const MultilineTextFieldView = (props: TextFieldViewProps) => {
    return <TextFieldViewContainer {...props}>
        <MultilineTextFieldTextInput {...props} />
    </TextFieldViewContainer>
}

export const TextFieldView = (props: TextFieldViewProps) => {

    return <TextFieldViewContainer {...props}>
        <TextFieldTextInput {...props} />
    </TextFieldViewContainer>
}










export interface TextFieldViewContainerProps extends React.PropsWithChildren<ViewProps> {
    topTitleText?: string;
}

export const TextFieldViewContainer = (() => {

    const styles = StyleSheet.create({
        root: {

        },
        topTitleText: {
            marginLeft: LayoutConstants.floatingCellStyles.padding * 0.5,
            fontFamily: CustomFont.medium
        },
    });

    const TextFieldViewContainer = (props: TextFieldViewContainerProps) => {
        return <SpacerView
            {...props}
            style={[styles.root, props.style]}
            space={10}
        >
            {typeof props.topTitleText === 'string' && <CustomizedText style={[styles.topTitleText, {
                color: CustomColors.offBlackTitle.stringValue,
            }]}>{props.topTitleText}</CustomizedText>}
            {props.children}
        </SpacerView>
    }
    return TextFieldViewContainer;
})();







export interface TextFieldTextInputProps {
    value?: string;
    onValueChange?: (newValue: string) => void;
    textInputProps?: Omit<TextInputProps, 'value' | 'onChangeText' | 'onFocus' | 'onBlur' | 'selectionColor'>
}

export const MultilineTextFieldTextInput = (props: TextFieldTextInputProps) => {
    return <TextFieldTextInput
        {...props}
        textInputProps={{
            returnKeyType: Platform.select({ web: 'enter', default: 'default' }) as any,
            scrollEnabled: false,
            multiline: true,
            style: [{
                minHeight: 175,
            }, props.textInputProps?.style],
            ...props.textInputProps,
        }}
    />
};

export const TextFieldTextInput = (() => {

    const styles = StyleSheet.create({
        textInput: {
            borderWidth: OrderConfirmationLayoutConstants.selectionOutline.width,
            borderRadius: 10,
            padding: TextFieldViewConstants.borderRadius,
            fontSize: 16,
            color: CustomColors.offBlackTitle.stringValue,
            ...(Platform.select({ web: { outlineStyle: 'none' }, default: undefined })),
        },
    });

    const TextFieldTextInput = (props: TextFieldTextInputProps) => {

        const [isActive, setIsActive] = useState(false);

        return <TextInput
            returnKeyType="done"
            selectionColor={CustomColors.themeGreen.stringValue}
            placeholderTextColor={Color.gray(0.7).stringValue}
            placeholder="Type here..."
            {...props.textInputProps}
            style={[styles.textInput, {
                borderColor: isActive ? OrderConfirmationLayoutConstants.selectionOutline.color.selected : OrderConfirmationLayoutConstants.selectionOutline.color.unselected,
            }, props.textInputProps?.style]}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
            value={props.value}
            onChangeText={text => props.onValueChange?.(text)}
        />
    }
    return TextFieldTextInput;
})();

