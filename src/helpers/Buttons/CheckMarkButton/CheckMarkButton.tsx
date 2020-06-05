

import React from 'react';
import { StyleSheet, ViewStyle, Image } from 'react-native';
import BouncyButton, { BouncyButtonProps } from '../BouncyButton';
import { CustomColors, Color } from '../../colors';

export interface CheckMarkButtonProps extends BouncyButtonProps {
    isSelected?: boolean
}

const CheckMarkButton = (() => {

    const styles = StyleSheet.create({
        root: {
            
        },
        buttonContentView: (() => {
            const size = 36;
            const styles: ViewStyle = {
                width: size,
                height: size,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
            };
            return styles;
        })(),
        checkMarkImage: {
            height: 15,
            width: 15,
        },
    });

    const CheckMarkButton = (props: CheckMarkButtonProps) => {

        const isSelected = props.isSelected ?? false;

        return <BouncyButton
            {...props}
            style={[styles.root, props.style]}
            contentViewProps={{
                style: [styles.buttonContentView, {
                    backgroundColor: (isSelected ? CustomColors.themeGreen : Color.gray(0.93)).stringValue,
                }, props.contentViewProps]
            }}
        >
            <Image style={[styles.checkMarkImage, {
                tintColor: isSelected ? 'white' : CustomColors.offBlackTitle.stringValue,
            }]} source={require('./checkIcon.png')} />
        </BouncyButton>
    }

    return CheckMarkButton;
})();

export default CheckMarkButton;
