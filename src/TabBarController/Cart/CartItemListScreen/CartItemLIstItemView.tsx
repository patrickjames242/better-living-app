
import React, { useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { MenuListItem } from '../../Menu/MenuListViewScreen/MenuListView/helpers';
import AspectRatioView from '../../../helpers/AspectRatioView';
import LayoutConstants from '../../../LayoutConstants';
import CustomizedText from '../../../helpers/CustomizedText';
import { CustomFont } from '../../../helpers/fonts/fonts';
import Spacer, { BaseSpacer } from '../../../helpers/Spacers/Spacer';
import { getShadowStyle } from '../../../helpers/general';
import HighlightButton from '../../../helpers/Buttons/HighlightView';
import { Color, CustomColors } from '../../../helpers/colors';
import SpacerView from '../../../helpers/Spacers/SpacerView';




export interface CartItemListItemViewProps {
    item: MenuListItem,
}

const CartItemListItemView = (() => {

    const imageBorderRadius = 10;

    const styles = StyleSheet.create({
        root: {
            padding: LayoutConstants.floatingCellStyles.padding,
            flexDirection: 'row',
            alignItems: 'center',
        },
        imageHolder: {
            width: 90,
            borderRadius: imageBorderRadius,
            // alignSelf: 'flex-start',
            ...getShadowStyle(5),
        },
        image: {
            width: '100%',
            height: '100%',
            borderRadius: imageBorderRadius,
        },
        center: {
            alignItems: 'flex-start',
            flex: 1,
        },
        title: {
            fontFamily: CustomFont.medium,
            fontSize: 16,
        },
        itemPriceSubtitle: {
            fontFamily: CustomFont.medium,
            fontSize: 14,
            color: CustomColors.offBlackSubtitle.stringValue,
        },
        totalPriceText: {
            fontFamily: CustomFont.medium,
            color: CustomColors.offBlackSubtitle.stringValue,
            fontSize: 17,
        },
    });

    const minQuantity = 1;
    const maxQuantity = 10;

    const CartItemListItemView = (props: CartItemListItemViewProps) => {

        const [quantity, setQuantity] = useState(minQuantity);

        function increment(){
            setQuantity(x => Math.min(x + 1, maxQuantity));
        }

        function decrement(){
            setQuantity(x => Math.max(x - 1, minQuantity))
        }

        return <View style={styles.root}>
            <Spacer space={15}>
                <AspectRatioView style={styles.imageHolder} heightPercentageOfWidth={LayoutConstants.productImageHeightPercentageOfWidth}>
                    <Image style={styles.image} source={props.item.imageSource} />
                </AspectRatioView>
                <SpacerView style={styles.center} space={5}>
                    <CustomizedText style={styles.title}>{props.item.name}</CustomizedText>
                    {quantity > 1 && <CustomizedText style={[styles.itemPriceSubtitle, {
                        marginBottom: 7,
                        marginTop: 2
                    }]}>Item price: $5.47</CustomizedText>}
                    <QuantityPickerView increment={increment} decrement={decrement} value={quantity}/>
                </SpacerView>
                <CustomizedText style={styles.totalPriceText}>$5.47</CustomizedText>
            </Spacer>
        </View>
    }
    return CartItemListItemView;
})();

export default CartItemListItemView;








interface QuantityPickerViewProps {
    value: number,
    increment: () => void,
    decrement: () => void,
}

const QuantityPickerView = (() => {

    const buttonSize = 35;

    const styles = StyleSheet.create({
        root: {
            borderRadius: 7,
            flexDirection: 'row',
            overflow: 'hidden',
            backgroundColor: Color.gray(0.95).stringValue,
        },
        buttons: {
            height: buttonSize * 0.9,
            width: buttonSize,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonText: {
            fontFamily: CustomFont.medium,
            fontSize: 18,
            color: Color.gray(0.4).stringValue,
        },
        centerLabelHolder: {
            minWidth: buttonSize,
            paddingLeft: 10,
            paddingRight: 10,
            alignItems: 'center',
            justifyContent: 'center',
        },
        centerLabel: {
            fontFamily: CustomFont.medium,
            fontSize: 15,
            color: Color.gray(0.4).stringValue,
        },
        separatorLine: {
            width: 1,
            backgroundColor: Color.gray(0.9).stringValue,
            marginTop: 6,
            marginBottom: 6,
        },
    });


    const QuantityPickerView = (props: QuantityPickerViewProps) => {

        return <View style={styles.root}>
            <BaseSpacer renderSpacer={() => <View style={styles.separatorLine}/>}>
                <HighlightButton style={[styles.buttons]} onPress={props.decrement}>
                    <CustomizedText style={styles.buttonText}>-</CustomizedText>
                </HighlightButton>
                <View style={styles.centerLabelHolder}>
                    <CustomizedText style={styles.centerLabel}>{props.value}</CustomizedText>
                </View>
                <HighlightButton style={[styles.buttons]} onPress={props.increment}>
                    <CustomizedText style={styles.buttonText}>+</CustomizedText>
                </HighlightButton>
            </BaseSpacer>
        </View>
    }
    return QuantityPickerView;
})();




