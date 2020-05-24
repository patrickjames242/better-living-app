
import React from 'react';
import LayoutConstants from '../../../../LayoutConstants';
import { ViewStyle, View, StyleSheet, Image } from 'react-native';
import BouncyButton from '../../../../helpers/Buttons/BouncyButton';
import { CustomColors, Color } from '../../../../helpers/colors';

const MealCreatorCheckBoxButton = (() => {

    const styles = StyleSheet.create({
        root: {
            padding: LayoutConstants.floatingCellStyles.padding,
            alignItems: 'center',
            justifyContent: 'center',
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

    const MealCreatorCheckBoxButton = (props: { onPress: () => void, isSelected: boolean }) => {
        const touchPadding = LayoutConstants.floatingCellStyles.padding;
        return <View style={styles.root}>
            <BouncyButton
                contentViewProps={{style: [styles.buttonContentView, {
                    backgroundColor: (props.isSelected ? CustomColors.themeGreen : Color.gray(0.93)).stringValue,
                }]}}
                hitSlop={{ left: touchPadding, right: touchPadding, top: touchPadding, bottom: touchPadding }}
                onPress={props.onPress}>
                <Image style={[styles.checkMarkImage, {
                    tintColor: props.isSelected ? 'white' : CustomColors.offBlackTitle.stringValue,
                }]} source={require('./checkIcon.png')} />
            </BouncyButton>
        </View>
    }

    return MealCreatorCheckBoxButton;
})();


export default MealCreatorCheckBoxButton;

