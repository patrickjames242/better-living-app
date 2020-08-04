
import React from 'react';
import { StyleSheet } from 'react-native';
import { CustomColors } from '../../../../helpers/colors';
import { getShadowStyle } from '../../../../helpers/general';
import { CustomFont } from '../../../../helpers/fonts/fonts';
import BouncyButton from '../../../../helpers/Buttons/BouncyButton';
import CustomizedText from '../../../../helpers/Views/CustomizedText';
import currency from 'currency.js';

export interface MealCreatorScreenAddToCartButtonProps {
    onPress?: () => void;
    price: number;
}

const MealCreatorScreenAddToCartButton = (() => {


    const styles = StyleSheet.create({
        root: {
            width: '100%',
            maxWidth: 400,
            alignSelf: 'center',
        },
        contentView: {
            backgroundColor: CustomColors.themeGreen.stringValue,
            borderRadius: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 17.5,
            paddingLeft: 18,
            paddingRight: 18,
            ...getShadowStyle(10),
        },
        text: {
            color: 'white',
            fontSize: 16,
            fontFamily: CustomFont.bold,
        },
    });

    const MealCreatorScreenAddToCartButton = (props: MealCreatorScreenAddToCartButtonProps) => {

        return <BouncyButton style={styles.root} contentViewProps={{ style: styles.contentView }} onPress={props.onPress} bounceScaleValue={0.9}>
            <CustomizedText style={styles.text}>Add to Cart</CustomizedText>
            <CustomizedText style={styles.text}>{currency(props.price).format()}</CustomizedText>
        </BouncyButton>

    }
    return MealCreatorScreenAddToCartButton;

})();


export default MealCreatorScreenAddToCartButton;