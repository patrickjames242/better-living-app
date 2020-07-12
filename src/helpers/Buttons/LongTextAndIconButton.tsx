
import React from 'react';
import { StyleSheet, View, Image, ActivityIndicator } from 'react-native';
import { CustomColors, Color } from '../colors';
import LayoutConstants from '../../LayoutConstants';
import { CustomFont } from '../fonts/fonts';
import BouncyButton, { BouncyButtonProps } from './BouncyButton';
import CustomizedText from '../Views/CustomizedText';

export interface LongTextAndIconButtonRef {
    setLoadingState(isLoading: boolean): void;
}

export interface LongTextAndIconButtonProps extends BouncyButtonProps {
    iconSource: any;
    text: string;
    backgroundColor?: Color;
    onPress?: () => void;
    isLoading?: boolean;
}

const LongTextAndIconButton = (() => {

    const styles = StyleSheet.create({
        root: {

        },
        contentView: {
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
        }, 
        activityIndicatorHolder: {
            ...StyleSheet.absoluteFillObject,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    

    const LongTextAndIconButton = (props: LongTextAndIconButtonProps) => {

        const isLoading = props.isLoading ?? false;

        const defaultBackgroundColor = (props.backgroundColor ?? CustomColors.themeGreen);
        const actualBackgroundColor = isLoading ? defaultBackgroundColor.withAdjustedOpacity(0.5 * defaultBackgroundColor.opacity) : defaultBackgroundColor;


        return <BouncyButton
            pointerEvents={isLoading ? 'none' : undefined}
            onPress={props.onPress}
            bounceScaleValue={0.925}
            {...props}
            style={[styles.root, props.style]}
            contentViewProps={{
                ...props.contentViewProps,
                style: [
                    styles.contentView,
                    props.contentViewProps?.style,
                    { backgroundColor:  actualBackgroundColor.stringValue},
                ]
            }}
        >
            <CustomizedText style={styles.text}>{props.text}</CustomizedText>
            <View style={styles.iconHolder}>
                <Image style={[styles.icon, {opacity: isLoading ? 0 : 1}]} source={props.iconSource} />
                <View style={[styles.activityIndicatorHolder, {opacity: isLoading ? 1 : 0}]}>
                    {isLoading && <ActivityIndicator color="white" size={25} />}
                </View>
            </View>
        </BouncyButton>

    }
    return LongTextAndIconButton;
})();

export default LongTextAndIconButton;

