import React from 'react';
import { StyleSheet } from 'react-native';
import BouncyButton, { BouncyButtonProps } from './BouncyButton';
import { CustomColors } from '../colors';


export interface  RoundedBouncyButtonProps extends BouncyButtonProps{

}


const RoundedBouncyButton = (() => {

    const styles = StyleSheet.create({
        root: {

        },
        contentView: {
            padding: 10,
            borderRadius: 100000,
            backgroundColor: CustomColors.themeGreen.stringValue
        }
    });

    const RoundedBouncyButton: React.FC<RoundedBouncyButtonProps> = props => {
        return <BouncyButton
            // set before the props are added because I want the callers props to take precedence
            bounceScaleValue={0.85}
            {...props}
            style={[styles.root, props.style]}
            contentViewProps={{
                style: [styles.contentView, props.contentViewProps?.style]
            }}
        >
            {props.children}
        </BouncyButton>
    };
    return RoundedBouncyButton;
})();

export default RoundedBouncyButton;