
import React from 'react';
import { StyleSheet } from 'react-native';
import { CustomFont } from '../fonts/fonts';
import CustomizedText from '../Views/CustomizedText';
import RoundedBouncyButton, { RoundedBouncyButtonProps } from './RoundedBouncyButton';

export interface RoundedTextBouncyButtonProps extends RoundedBouncyButtonProps {
    text: string,
    isEnabled?: boolean;
}

const RoundedTextBouncyButton = (() => {

    const styles = StyleSheet.create({
        root: {

        },
        contentView: {
            padding: 15,
            paddingTop: 10,
            paddingBottom: 10,
        },
        text: {
            color: 'white',
            fontSize: 13,
            fontFamily: CustomFont.medium,
        }
    });

    const RoundedTextBouncyButton: React.FC<RoundedTextBouncyButtonProps> = props => {
        const isEnabled = (props.isEnabled ?? true);
        return <RoundedBouncyButton
            {...props}
            pointerEvents={isEnabled ? 'auto' : 'none'}
            style={[styles.root, props.style, {opacity: isEnabled ? 1 : 0.5}]}
            contentViewProps={{
                style: [styles.contentView, props.contentViewProps?.style]
            }}
        >
            <CustomizedText
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={styles.text}
            >{props.text}</CustomizedText>
        </RoundedBouncyButton>
    };

    return RoundedTextBouncyButton;
})();

export default RoundedTextBouncyButton;

