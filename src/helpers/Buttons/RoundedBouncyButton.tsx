import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import BouncyButton from './BouncyButton';
import { CustomColors } from '../colors';

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

    const RoundedBouncyButton: React.FC<ViewProps> = props => {
        return <BouncyButton {...props} style={[styles.root, props.style]} bounceScaleValue={0.8}>
            {props.children}
        </BouncyButton>
    };
    return RoundedBouncyButton;
})();

export default RoundedBouncyButton;