
import React, { useState } from 'react';
import { ViewProps, TextInputProps, StyleSheet, TextInput, Platform, StyleProp, ViewStyle } from 'react-native';
import LayoutConstants from '../../LayoutConstants';
import { CustomColors, Color } from '../colors';
import { CustomFont } from '../fonts/fonts';
import SpacerView from '../Spacers/SpacerView';
import CustomizedText from './CustomizedText';



export interface TextFieldViewProps {
    textFieldContainer?: TextFieldViewContainerProps;
    textInputProps?: TextFieldTextInputProps;

    topTitleText?: string;
    errorMessage?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    style?: StyleProp<ViewStyle>;
}

export const MultilineTextFieldView = (props: TextFieldViewProps) => {
    return <TextFieldViewContainer style={props.style} topTitleText={props.topTitleText} errorMessage={props.errorMessage} {...props.textFieldContainer}>
        <MultilineTextFieldTextInput value={props.value} onChangeText={props.onChangeText} placeholder={props.placeholder} {...props.textInputProps} />
    </TextFieldViewContainer>
}

export const TextFieldView = (props: TextFieldViewProps) => {
    return <TextFieldViewContainer style={props.style} topTitleText={props.topTitleText} errorMessage={props.errorMessage} {...props.textFieldContainer}>
        <TextFieldTextInput value={props.value} onChangeText={props.onChangeText} placeholder={props.placeholder} {...props.textInputProps} />
    </TextFieldViewContainer>
}










export interface TextFieldViewContainerProps extends React.PropsWithChildren<ViewProps> {
    topTitleText?: string;
    errorMessage?: string;
}

export const TextFieldViewContainer = (() => {

    const titleLeftInset = LayoutConstants.floatingCellStyles.padding * 0.5;

    const styles = StyleSheet.create({
        root: {

        },
        topTitleText: {
            marginLeft: titleLeftInset,
            fontFamily: CustomFont.medium
        },
        errorText: {
            marginLeft: titleLeftInset,
            color: CustomColors.redColor.stringValue,
            fontFamily: CustomFont.medium,
        },
    });


    const TextFieldViewContainer = (props: TextFieldViewContainerProps) => {
        return <SpacerView
            {...props}
            style={[styles.root, props.style]}
            space={10}
        >
            {typeof props.topTitleText === 'string' &&
                <CustomizedText style={[styles.topTitleText, {
                    color: CustomColors.offBlackTitle.stringValue,
                }]}>{props.topTitleText}</CustomizedText>}
            {props.children}
            {typeof props.errorMessage === 'string' && props.errorMessage.trim().length > 0 &&
                <CustomizedText style={styles.errorText}>{props.errorMessage}</CustomizedText>}
        </SpacerView>
    }
    return TextFieldViewContainer;
})();







export interface TextFieldTextInputProps extends TextInputProps {
    inactiveBorderColor?: string; 
}

export const MultilineTextFieldTextInput = (props: TextFieldTextInputProps) => {
    return <TextFieldTextInput
        {...props}
        returnKeyType={props.returnKeyType ?? Platform.select({ web: 'enter', default: 'default' }) as any}
        scrollEnabled={props.scrollEnabled ?? false}
        multiline={props.multiline ?? true}
        style={[{
            minHeight: 175,
        }, props.style]}
    />
};

export const TextFieldTextInput = (() => {

    const styles = StyleSheet.create({
        textInput: {
            borderWidth: LayoutConstants.forms.textFieldSelectionOutline.width,
            borderRadius: LayoutConstants.forms.innerContainer.borderRadius,
            padding: 10,
            fontSize: 16,
            color: CustomColors.offBlackTitle.stringValue,
            ...(Platform.select({ web: { outlineStyle: 'none' }, default: undefined })),
        },
    });

    const TextFieldTextInput = ({inactiveBorderColor, ...props}: TextFieldTextInputProps) => {

        const [isActive, setIsActive] = useState(false);

        return <TextInput
            {...props}
            returnKeyType={props.returnKeyType ?? "done"}
            selectionColor={props.selectionColor ?? CustomColors.themeGreen.stringValue}
            placeholderTextColor={props.placeholderTextColor ?? Color.gray(0.7).stringValue}
            placeholder={props.placeholder ?? "Type here..."}
            style={[styles.textInput, {
                borderColor: isActive ? LayoutConstants.forms.textFieldSelectionOutline.color.selected : (inactiveBorderColor ?? LayoutConstants.forms.textFieldSelectionOutline.color.unselected),
            }, props.style]}
            onFocus={e => { setIsActive(true); props.onFocus?.(e) }}
            onBlur={e => { setIsActive(false); props.onBlur?.(e) }}
        />
    }
    return TextFieldTextInput;
})();

