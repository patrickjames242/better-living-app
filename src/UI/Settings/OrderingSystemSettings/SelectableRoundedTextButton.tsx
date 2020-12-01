
import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import BouncyButton from '../../../helpers/Buttons/BouncyButton';
import { CustomColors, Color } from '../../../helpers/colors';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import { CustomFont } from '../../../helpers/fonts/fonts';


export interface SelectableRoundedTextButtonProps extends ViewProps {
    onPress?: () => void;
    title: string;
    isSelected?: boolean;
}

const SelectableRoundedTextButton = (() => {

    const styles = StyleSheet.create({
        contentContainer: {
            borderRadius: 10000,
            padding: 10,
            paddingLeft: 14,
            paddingRight: 14,
        },
        title: {
            fontSize: 14,
        }
    });

    const SelectableRoundedTextButton = (props: SelectableRoundedTextButtonProps) => {

        const isSelected = props.isSelected ?? true;

        return <BouncyButton
            {...props}
            contentViewProps={{
                style: [styles.contentContainer, {
                    backgroundColor: isSelected ? CustomColors.themeGreen.stringValue : Color.gray(0.955).stringValue,
                }]
            }}
            bounceScaleValue={0.85}
        >
            <CustomizedText style={[styles.title, {
                color: isSelected ? 'white' : CustomColors.offBlackTitle.stringValue,
                fontFamily: isSelected ? CustomFont.medium : CustomFont.regular,
            }]}>{props.title}</CustomizedText>
        </BouncyButton>
    }
    return SelectableRoundedTextButton;
})();

export default SelectableRoundedTextButton;

