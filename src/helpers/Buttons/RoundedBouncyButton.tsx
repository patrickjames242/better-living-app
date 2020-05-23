import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import BouncyButton from './BouncyButton';
import { CustomColors } from '../colors';

export interface RoundedBouncyButtonProps extends ViewProps{
    onPress?: () => void,
}

const RoundedBouncyButton = (() => {

    const styles = StyleSheet.create({
        root: {
            backgroundColor: CustomColors.themeGreen.stringValue,
            padding: 15,
            paddingTop: 10,
            paddingBottom: 10,
            borderRadius: 100000,
        },
    });

    const RoundedBouncyButton: React.FC<RoundedBouncyButtonProps> = props => {
        return <BouncyButton {...props} style={[styles.root, props.style]} bounceScaleValue={0.8} onPress={props.onPress}>
            {props.children}
        </BouncyButton>
    };
    return RoundedBouncyButton;
})();

export default RoundedBouncyButton;