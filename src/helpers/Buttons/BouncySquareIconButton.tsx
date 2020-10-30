
import React from 'react';
import {StyleSheet, Image} from 'react-native';
import BouncyButton, { BouncyButtonProps } from './BouncyButton';
import { CustomColors, Color } from '../colors';

export interface BouncySquareIconButtonProps extends BouncyButtonProps{
    isEnabled?: boolean;
    isSelected?: boolean;
    iconSources: {
        offBlack?: any,
        white: any,
    };
    backgroundColor?: string;
    iconSize?: number;
    iconPadding?: number; 
}

const BouncySquareIconButton = (() => {
    
    const styles = StyleSheet.create({
        root: {
            
        },
        buttonContentView: {
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        iconImage: {
        },
    });
    
    const BouncySquareIconButton = ({
        isEnabled: propsIsEnabledValue,
        isSelected: propsIsSelectedValue, 
        iconSources, 
        backgroundColor, 
        iconPadding,
        iconSize,
        ...bouncyButtonProps
    }: BouncySquareIconButtonProps) => {

        const isEnabled = propsIsEnabledValue ?? true;
        const isSelected = propsIsSelectedValue ?? true;

        return <BouncyButton
            pointerEvents={isEnabled ? undefined : 'none'}
            {...bouncyButtonProps}
            style={[styles.root, bouncyButtonProps.style]}
            contentViewProps={{
                style: [styles.buttonContentView, {
                    backgroundColor: isSelected ? (backgroundColor ?? CustomColors.themeGreen.stringValue) : Color.gray(0.93).stringValue,
                    padding: iconPadding ?? 10.5,
                    opacity: isEnabled ? 1 : 0.5,
                }, bouncyButtonProps.contentViewProps]
            }}
        >
            <Image resizeMode="contain" style={[styles.iconImage, {
                width: iconSize ?? 15,
                height: iconSize ?? 15,
            }]} source={isSelected ? iconSources.white : (iconSources.offBlack ?? iconSources.white)} />
        </BouncyButton>
    }
    return BouncySquareIconButton;
})();

export default BouncySquareIconButton;
