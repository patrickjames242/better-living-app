

import React, { useState, useRef } from 'react';
import { StyleSheet, Image, Animated } from 'react-native';
import { MenuListItem } from '../../Menu/MenuListViewScreen/MenuListView/helpers';
import AspectRatioView from '../../../helpers/Views/AspectRatioView';
import LayoutConstants from '../../../LayoutConstants';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import { CustomFont } from '../../../helpers/fonts/fonts';
import { getShadowStyle, Optional, mapOptional } from '../../../helpers/general';
import { CustomColors, Color } from '../../../helpers/colors';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import QuantityPickerView from './QuantityPickerView';
import HighlightButton from '../../../helpers/Buttons/HighlightView';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import BouncyButton from '../../../helpers/Buttons/BouncyButton';
import ValueBox from '../../../helpers/ValueBox';
import { useNotificationListener } from '../../../helpers/Notification';
import { useNavigationScreenContext } from '../../../helpers/NavigationController/NavigationScreen';
import PresentableScreens from '../../../PresentableScreens';
import AssetImages from '../../../images/AssetImages';



export interface CartItemListItemViewProps {
    item: MenuListItem,
    // the number refers to the id of the item
    currentlyOpenDrawerID: ValueBox<Optional<number>>
}



const CartItemListItemView = (() => {

    const imageBorderRadius = 10;

    const styles = StyleSheet.create({
        root: {

        },
        contentView: {
            padding: LayoutConstants.floatingCellStyles.padding,
            flexDirection: 'row',
            alignItems: 'center',
        },
        imageHolder: {
            width: 90,
            borderRadius: imageBorderRadius,
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
        rightSide: {
            alignItems: 'flex-end',
        },
        quantityTimesPriceText: {
            fontFamily: CustomFont.medium,
            color: CustomColors.offBlackSubtitle.stringValue,
            fontSize: 14,
        },
        totalPriceText: {
            fontFamily: CustomFont.medium,
            fontSize: 18,
            color: Color.gray(0.4).stringValue,
        },
    });

    const minQuantity = 1;
    const maxQuantity = 10;

    const CartItemListItemView = (props: CartItemListItemViewProps) => {

        const [quantity, setQuantity] = useState(minQuantity);

        function increment() {
            setQuantity(x => Math.min(x + 1, maxQuantity));
        }

        function decrement() {
            setQuantity(x => Math.max(x - 1, minQuantity))
        }

        const swipeableRef = useRef<Swipeable>(null);

        const swipeableIsOpen = useRef(false);

        useNotificationListener(props.currentlyOpenDrawerID.observer, newValue => {
            if (newValue !== props.item.id && swipeableIsOpen.current){
                swipeableRef.current?.close();
            }
        }, [props.item.id]);

        const navigationScreenContext = useNavigationScreenContext();

        function presentMenuItemDetailView() {
            if (props.currentlyOpenDrawerID.value === props.item.id){return;}
            mapOptional(PresentableScreens.MenuItemDetailScreen(), Component => {
                navigationScreenContext.present(<Component />)
            });
        }

        return <HighlightButton style={styles.root} onPress={presentMenuItemDetailView}>
            <Swipeable
                ref={swipeableRef}
                useNativeAnimations
                overshootRight={false}
                overshootFriction={3}
                onSwipeableWillOpen={() => {
                    swipeableIsOpen.current = true;
                    props.currentlyOpenDrawerID.value = props.item.id;
                }}
                onSwipeableWillClose={() => {
                    swipeableIsOpen.current = false;
                }}
                onSwipeableClose={() => {
                    if (props.currentlyOpenDrawerID.value !== props.item.id){return;}
                    props.currentlyOpenDrawerID.value = null;
                }}
                renderRightActions={(_, dragValue) => {
                    return <SwipableButtonActions dragAnimatedValue={dragValue} />
                }}
            >
                <SpacerView space={15} style={styles.contentView}>
                    <AspectRatioView style={styles.imageHolder} heightPercentageOfWidth={LayoutConstants.productImageHeightPercentageOfWidth}>
                        <Image style={styles.image} source={props.item.imageSource} />
                    </AspectRatioView>
                    <SpacerView style={styles.center} space={9}>
                        <CustomizedText style={styles.title}>{props.item.name}</CustomizedText>
                        <QuantityPickerView increment={increment} decrement={decrement} value={quantity} />
                    </SpacerView>
                    <SpacerView style={styles.rightSide} space={7}>
                        {quantity > 1 && <CustomizedText style={styles.quantityTimesPriceText}>{quantity + " × $5.47"}</CustomizedText>}
                        <CustomizedText style={styles.totalPriceText}>$5.47</CustomizedText>
                    </SpacerView>
                </SpacerView>
            </Swipeable>
        </HighlightButton>
    }
    return CartItemListItemView;
})();

export default CartItemListItemView;










interface SwipableButtonActionsProps {
    dragAnimatedValue: Animated.AnimatedInterpolation,
    onDeleteButtonPressed?: () => void;
}

const SwipableButtonActions = (() => {

    const imageWidth = 22.5;
    const imagePadding = 12.5;
    const buttonWidth = imageWidth + (imagePadding * 2);
    const buttonRightInset = 30;
    const buttonLeftInset = buttonRightInset - LayoutConstants.floatingCellStyles.padding;
    const totalContainerWidth = buttonLeftInset + buttonWidth + buttonRightInset;

    const styles = StyleSheet.create({
        root: {
            paddingLeft: buttonLeftInset,
            paddingRight: buttonRightInset,
            justifyContent: 'center',
            alignItems: 'center',
        },
        trashCanButtonContent: {
            padding: imagePadding,
            backgroundColor: CustomColors.redColor.stringValue,
            borderRadius: 10
        },
        trashButtonImage: {
            width: imageWidth,
            height: imageWidth,
            tintColor: 'white',
        }
    });

    const SwipableButtonActions = (props: SwipableButtonActionsProps) => {

        const translateX = props.dragAnimatedValue.interpolate({
            inputRange: [-totalContainerWidth, 0],
            outputRange: [0, totalContainerWidth]
        });

        return <Animated.View style={[styles.root, { transform: [{ translateX }] }]}>
            <BouncyButton onPress={props.onDeleteButtonPressed} contentViewProps={{ style: styles.trashCanButtonContent }}>
                <Image style={styles.trashButtonImage} source={AssetImages.deleteIcon} />
            </BouncyButton>
        </Animated.View>
    }
    return SwipableButtonActions;
})();





