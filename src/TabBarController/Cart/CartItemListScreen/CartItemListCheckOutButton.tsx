
import React from 'react';
import { StyleSheet } from 'react-native';

import GreenTextAndIconButton from '../../../helpers/Buttons/GreenTextAndIconButton';


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
        return <GreenTextAndIconButton
            iconSource={require('../../TabBar/icons/shopping-cart.png')}
            text="Confirm Order"
            style={[styles.root, {maxWidth: props.maxWidth}]}
            onPress={props.onPress}
        />
    }

    return CartItemListCheckOutButton;
})();

export default CartItemListCheckOutButton;



