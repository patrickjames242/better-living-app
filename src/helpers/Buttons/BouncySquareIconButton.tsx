
import React from 'react';
import {StyleSheet, ViewStyle, Image} from 'react-native';
import BouncyButton, { BouncyButtonProps } from './BouncyButton';
import { CustomColors, Color } from '../colors';

export interface BouncySquareIconButtonProps extends BouncyButtonProps{
    isSelected?: boolean;
    iconSource: any;
    backgroundColor?: string;
}

const BouncySquareIconButton = (() => {
    
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
        iconImage: {
            height: 15,
            width: 15,
        },
    });
    
    const BouncySquareIconButton = ({
        isSelected: propsIsSelectedValue, 
        iconSource, 
        backgroundColor, 
        ...bouncyButtonProps
    }: BouncySquareIconButtonProps) => {

        const isSelected = propsIsSelectedValue ?? true;

        return <BouncyButton
            {...bouncyButtonProps}
            style={[styles.root, bouncyButtonProps.style]}
            contentViewProps={{
                style: [styles.buttonContentView, {
                    backgroundColor: isSelected ? (backgroundColor ?? CustomColors.themeGreen.stringValue)  : Color.gray(0.93).stringValue,
                }, bouncyButtonProps.contentViewProps]
            }}
        >
            <Image style={[styles.iconImage, {
                tintColor: isSelected ? 'white' : CustomColors.offBlackTitle.stringValue,
            }]} source={iconSource} />
        </BouncyButton>
    }
    return BouncySquareIconButton;
})();

export default BouncySquareIconButton;
