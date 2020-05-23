
import React from 'react';
import { CustomColors } from '../colors';
import { ViewProps, StyleSheet } from 'react-native';
import { CustomFont } from '../fonts/fonts';
import CustomizedText from '../CustomizedText';
import RoundedBouncyButton, { RoundedBouncyButtonProps } from './RoundedBouncyButton';

export interface RoundedTextBouncyButtonProps extends RoundedBouncyButtonProps{
    text: string,
}

const RoundedTextBouncyButton = (() => {

    const styles = StyleSheet.create({
        root: {
            backgroundColor: CustomColors.themeGreen.stringValue,
            padding: 15,
            paddingTop: 10,
            paddingBottom: 10,
            borderRadius: 1000,
        },
        text: {
            color: 'white',
            fontSize: 13,
            fontFamily: CustomFont.medium,
        }
    });

    const RoundedTextBouncyButton: React.FC<RoundedTextBouncyButtonProps> = props => {
        return <RoundedBouncyButton {...props} style={[styles.root, props.style]} onPress={props.onPress}>
            <CustomizedText numberOfLines={1} ellipsizeMode={'tail'} style={styles.text}>{props.text}</CustomizedText>
        </RoundedBouncyButton>
    };

    return RoundedTextBouncyButton;
})();

export default RoundedTextBouncyButton;

