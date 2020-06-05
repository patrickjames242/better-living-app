
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import CustomizedText from '../../../helpers/CustomizedText';
import { CustomFont } from '../../../helpers/fonts/fonts';
import BouncyButton from '../../../helpers/Buttons/BouncyButton';
import { CustomColors, Color } from '../../../helpers/colors';
import LayoutConstants from '../../../LayoutConstants';


interface CartItemListCheckOutButton {
    maxWidth: number;
    onPress: () => void;
}

const CartItemListCheckOutButton = (() => {

    const styles = StyleSheet.create({
        root: {
            alignSelf: 'center',
            width: '100%',
        },
        contentView: {
            backgroundColor: CustomColors.themeGreen.stringValue,
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        confirmOrderText: {
            color: 'white',
            marginLeft: LayoutConstants.pageSideInsets,
            fontSize: 17,
            fontFamily: CustomFont.medium,
        },
        cartIconHolder: {
            margin: 7,
            padding: 10,
            backgroundColor: (new Color(255, 255, 255)).withAdjustedOpacity(0.2).stringValue,
            borderRadius: 10,
        },
        cartIcon: {
            width: 22,
            height: 22,
            tintColor: 'white',
        }
    });

    const CartItemListCheckOutButton = (props: CartItemListCheckOutButton) => {
        return <BouncyButton
            style={[styles.root, {maxWidth: props.maxWidth}]}
            contentViewProps={{ style: styles.contentView }}
            bounceScaleValue={0.925}
            onPress={props.onPress}
        >
            <CustomizedText style={styles.confirmOrderText}>Confirm Order</CustomizedText>
            <View style={styles.cartIconHolder}>
                <Image style={styles.cartIcon} source={require('../../TabBar/icons/shopping-cart.png')} />
            </View>
        </BouncyButton>
    }

    return CartItemListCheckOutButton;
})();

export default CartItemListCheckOutButton;



