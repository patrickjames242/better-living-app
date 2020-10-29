
import React from 'react';
import { StyleSheet } from 'react-native';

import LongTextAndIconButton from '../../../helpers/Buttons/LongTextAndIconButton';


interface CartItemListCheckOutButtonProps {
    maxWidth: number;
    onPress: () => void;
}

const CartItemListCheckOutButton = (() => {

    const styles = StyleSheet.create({
        root: {
            alignSelf: 'center',
            width: '100%',
        },
    });

    const CartItemListCheckOutButton = (props: CartItemListCheckOutButtonProps) => {
        return <LongTextAndIconButton
            iconSource={require('../../TabBarController/icons/shopping-cart.png')}
            text="Confirm Order"
            style={[styles.root, {maxWidth: props.maxWidth}]}
            onPress={props.onPress}
        />
    }

    return CartItemListCheckOutButton;
})();

export default CartItemListCheckOutButton;



