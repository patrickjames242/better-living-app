import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import { CustomColors, Color } from '../colors';
import LayoutConstants from '../../LayoutConstants';
import { CustomFont } from '../fonts/fonts';
import BouncyButton, { BouncyButtonProps } from './BouncyButton';
import CustomizedText from '../CustomizedText';

export interface GreenTextAndIconButtonProps extends BouncyButtonProps{
    iconSource: any;
    text: string;
}

const GreenTextAndIconButton = (() => {
    
    const styles = StyleSheet.create({
        root: {
        },
        contentView: {
            backgroundColor: CustomColors.themeGreen.stringValue,
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        text: {
            color: 'white',
            marginLeft: LayoutConstants.pageSideInsets,
            fontSize: 17,
            fontFamily: CustomFont.medium,
        },
        iconHolder: {
            margin: 7,
            padding: 10,
            backgroundColor: (new Color(255, 255, 255)).withAdjustedOpacity(0.2).stringValue,
            borderRadius: 10,
        },
        icon: {
            width: 22,
            height: 22,
            tintColor: 'white',
        }
    });
    
    const GreenTextAndIconButton = (props: GreenTextAndIconButtonProps) => {
        return <BouncyButton
            bounceScaleValue={0.925}
            {...props}
            style={[styles.root, props.style]}
            contentViewProps={{ 
                ...props.contentViewProps,
                style: [styles.contentView, props.contentViewProps?.style]
            }}
        >
            <CustomizedText style={styles.text}>{props.text}</CustomizedText>
            <View style={styles.iconHolder}>
                <Image style={styles.icon} source={props.iconSource} />
            </View>
        </BouncyButton>
    }
    return GreenTextAndIconButton;
})();

export default GreenTextAndIconButton;