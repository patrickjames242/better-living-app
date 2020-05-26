
import React from 'react';
import LayoutConstants from '../../../../LayoutConstants';
import MealCreatorConstants from '../MealCreatorConstants';
import { CustomColors } from '../../../../helpers/colors';
import { getShadowStyle } from '../../../../helpers/general';
import { CustomFont } from '../../../../helpers/fonts/fonts';
import { TabBarPosition } from '../../../helpers';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BouncyButton from '../../../../helpers/Buttons/BouncyButton';
import CustomizedText from '../../../../helpers/CustomizedText';
import { useSelector } from '../../../../redux/store';


export interface MealCreatorScreenAddToCartButtonProps {
    onPress?: () => void;
    shouldGradientBeVisible: boolean,
}

const MealCreatorScreenAddToCartButton = (() => {


    const styles = StyleSheet.create({
        root: {
            position: 'absolute',
            bottom: 0,
            left: 0, right: 0,
            paddingLeft: LayoutConstants.pageSideInsets,
            paddingRight: LayoutConstants.pageSideInsets,
            paddingBottom: MealCreatorConstants.addToCartButton.bottomInset,
        },
        linearGradient: {
            position: 'absolute',
            left: 0, right: 0,
            top: -70,
            
        },
        button: {
            width: '100%',
            maxWidth: 400,
            alignSelf: 'center',
        },
        contentView: {
            backgroundColor: CustomColors.themeGreen.stringValue,
            borderRadius: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: MealCreatorConstants.addToCartButton.padding,
            paddingLeft: 18,
            paddingRight: 18,
            ...getShadowStyle(10),
        },
        text: {
            color: 'white',
            fontSize: MealCreatorConstants.addToCartButton.fontSize,
            fontFamily: CustomFont.bold,
        },
    });

    const MealCreatorScreenAddToCartButton = (props: MealCreatorScreenAddToCartButtonProps) => {

        const tabBarIsOnBottom = useSelector(state => state.tabBarController.tabBarPosition === TabBarPosition.bottom);
        return <View style={styles.root} pointerEvents="box-none">
            <LinearGradient 
                colors={[CustomColors.mainBackgroundColor.withAdjustedOpacity(0).stringValue, CustomColors.mainBackgroundColor.withAdjustedOpacity(1).stringValue]}
                start={[0.5, 0]}
                end={[0.5, 0.9]}
                style={[styles.linearGradient, {
                    opacity: props.shouldGradientBeVisible ? 1 : 0, 
                    bottom: tabBarIsOnBottom ? -LayoutConstants.navBar.cornerRadius : 0,
                }]}
                pointerEvents="none"
            />

            <BouncyButton style={styles.button} contentViewProps={{ style: styles.contentView }} onPress={props.onPress} bounceScaleValue={0.9}>
                <CustomizedText style={styles.text}>Add to Cart</CustomizedText>
                <CustomizedText style={styles.text}>$11.88</CustomizedText>
            </BouncyButton>
        </View>

    }
    return MealCreatorScreenAddToCartButton;

})();


export default MealCreatorScreenAddToCartButton;