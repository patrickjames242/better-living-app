
import React, { Ref, useState } from 'react';
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

    textInputRef?: Ref<TextInput>;
}

export const MultilineTextFieldView = (props: TextFieldViewProps) => {
    return <TextFieldViewContainer style={props.style} topTitleText={props.topTitleText} errorMessage={props.errorMessage} {...props.textFieldContainer}>
        <MultilineTextFieldTextInput ref={props.textInputRef} value={props.value} onChangeText={props.onChangeText} placeholder={props.placeholder} {...props.textInputProps} />
    </TextFieldViewContainer>
}

export const TextFieldView = (props: TextFieldViewProps) => {
    return <TextFieldViewContainer style={props.style} topTitleText={props.topTitleText} errorMessage={props.errorMessage} {...props.textFieldContainer}>
        <TextFieldTextInput ref={props.textInputRef} value={props.value} onChangeText={props.onChangeText} placeholder={props.placeholder} {...props.textInputProps} />
    </TextFieldViewContainer>
}










export interface TextFieldViewContainerProps extends React.PropsWithChildren<ViewProps> {
    topTitleText?: string;
    errorMessage?: string;
}

export const TextFieldViewContainer = (() => {

    const titleInsets = LayoutConstants.forms.textFieldTitleInset;

    const styles = StyleSheet.create({
        root: {

        },
        topTitleText: {
            marginLeft: titleInsets,
            marginRight: titleInsets,
            fontFamily: CustomFont.medium
        },
        errorText: {
            marginLeft: titleInsets,
            marginRight: titleInsets,
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

export const MultilineTextFieldTextInput = (() => {
    const MultilineTextFieldTextInput: React.ForwardRefRenderFunction<TextInput, TextFieldTextInputProps> = (props, ref) => {
        return <TextFieldTextInput
            ref={ref}
            returnKeyType={props.returnKeyType ?? Platform.select({ web: 'enter', default: 'default' }) as any}
            scrollEnabled={props.scrollEnabled ?? false}
            multiline={props.multiline ?? true}
            textAlignVertical="top"
            {...props}
            style={[{
                minHeight: 175,
            }, props.style]}
        />
    };
    return React.forwardRef(MultilineTextFieldTextInput);
})();



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

    const TextFieldTextInput: React.ForwardRefRenderFunction<TextInput, TextFieldTextInputProps> = (props, ref) => {

        const [isActive, setIsActive] = useState(false);

        return <TextInput
            {...props}
            ref={ref}
            returnKeyType={props.returnKeyType ?? "done"}
            selectionColor={props.selectionColor ?? CustomColors.themeGreen.stringValue}
            placeholderTextColor={props.placeholderTextColor ?? Color.gray(0.7).stringValue}
            placeholder={props.placeholder ?? "Type here..."}
            style={[styles.textInput, {
                borderColor: isActive ? LayoutConstants.forms.textFieldSelectionOutline.color.selected : (props.inactiveBorderColor ?? LayoutConstants.forms.textFieldSelectionOutline.color.unselected),
            }, props.style]}
            onFocus={e => { setIsActive(true); props.onFocus?.(e) }}
            onBlur={e => { setIsActive(false); props.onBlur?.(e) }}
        />
    }

    return React.forwardRef(TextFieldTextInput);
})();

