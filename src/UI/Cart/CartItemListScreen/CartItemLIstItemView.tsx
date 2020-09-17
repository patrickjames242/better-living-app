

import React, { useMemo, useRef } from 'react';
import { StyleSheet, Image, Animated } from 'react-native';
import LayoutConstants from '../../../LayoutConstants';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import { CustomFont } from '../../../helpers/fonts/fonts';
import { Optional } from '../../../helpers/general';
import { CustomColors, Color } from '../../../helpers/colors';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import QuantityPickerView from './QuantityPickerView';
import HighlightButton from '../../../helpers/Buttons/HighlightView';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import BouncyButton from '../../../helpers/Buttons/BouncyButton';
import ValueBox from '../../../helpers/ValueBox';
import { useNotificationListener } from '../../../helpers/Notification';
import AssetImages from '../../../images/AssetImages';
import store, { useSelector } from '../../../redux/store';
import { changeMealEntryQuantity, changeProductEntryQuantity, IncrememntOrDecrement, removeMealFromCart, removeProductFromCart } from '../../../api/cart/requests';
import ProductImageThumbnailView from '../../../helpers/Views/DataSpecificViews/ProductImageThumbnailView';
import { CartProductEntry } from '../../../api/cart/CartProductEntry';
import { CartMealEntry } from '../../../api/cart/CartMealEntry';
import Product from '../../../api/orderingSystem/products/Product';
import Meal from '../../../api/orderingSystem/meals/Meal';
import currency from 'currency.js';
import { CartEntry, deleteCartEntryAction } from '../../../redux/cart';
import { displayErrorMessage } from '../../../helpers/Alerts';


export interface CartItemListItemViewProps {
    entry: CartProductEntry | CartMealEntry,
    // the string refers to the id of the item
    currentlyOpenDrawerID: ValueBox<Optional<string>>
}



const CartItemListItemView = (() => {

    // const imageBorderRadius = 10;

    const styles = StyleSheet.create({
        root: {

        },
        contentView: {
            padding: LayoutConstants.floatingCellStyles.padding,
            flexDirection: 'row',
            alignItems: 'center',
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

    const CartItemListItemView = (props: CartItemListItemViewProps) => {

        const productOrMeal = useSelector(state => {
            if (props.entry instanceof CartProductEntry) {
                return state.orderingSystem.products.get(props.entry.productId);
            } else if (props.entry instanceof CartMealEntry) {
                return state.orderingSystem.meals.get(props.entry.mealId);
            }
        });

        const quantity = useSelector(state => {
            const entry = state.cart.get(props.entry.id);
            if (entry?.pendingQuantityChangesInfo) {
                return entry.pendingQuantityChangesInfo.originalQuantity + entry.pendingQuantityChangesInfo.pendingChange;
            } else {
                return entry?.entry.quantity ?? 0;
            }
        });

        const individualPrice = useMemo(() => {
            if (productOrMeal instanceof Product) {
                return productOrMeal.shouldBeSoldIndividually ? (productOrMeal.individualPrice ?? 0) : 0;
            } else if (productOrMeal instanceof Meal) {
                return productOrMeal.price
            } else { return 0; }
        }, [productOrMeal]);

        const latestIncrementDecrementPromise = useRef<Optional<Promise<CartEntry>>>(null);

        function incrementOrDecrement(incrementOrDecrement: IncrememntOrDecrement) {
            switch (incrementOrDecrement) {
                case IncrememntOrDecrement.increment:
                    if (quantity >= 50) return; break;
                case IncrememntOrDecrement.decrement:
                    if (quantity <= 1) return; break;
            }
            const promise: Promise<CartEntry> = (() => {
                if (props.entry instanceof CartProductEntry) {
                    return changeProductEntryQuantity(props.entry.id, incrementOrDecrement);
                } else {
                    return changeMealEntryQuantity(props.entry.id, incrementOrDecrement)
                }
            })();
            if (promise !== latestIncrementDecrementPromise.current){
                promise.catch(error => {
                    displayErrorMessage(error.message);
                });
                latestIncrementDecrementPromise.current = promise;
            }
        }

        const swipeableRef = useRef<Swipeable>(null);

        const swipeableIsOpen = useRef(false);

        useNotificationListener(props.currentlyOpenDrawerID.observer, newValue => {
            if (newValue !== props.entry.id && swipeableIsOpen.current) {
                swipeableRef.current?.close();
            }
        }, [props.entry.id]);


        function presentMenuItemDetailView() {

        }

        if (productOrMeal == null) {
            return <></>
        }

        return <HighlightButton style={styles.root} onPress={presentMenuItemDetailView}>
            <Swipeable
                ref={swipeableRef}
                useNativeAnimations
                overshootRight={false}
                overshootFriction={3}
                onSwipeableWillOpen={() => {
                    swipeableIsOpen.current = true;
                    props.currentlyOpenDrawerID.value = props.entry.id;
                }}
                onSwipeableWillClose={() => {
                    swipeableIsOpen.current = false;
                }}
                onSwipeableClose={() => {
                    if (props.currentlyOpenDrawerID.value !== props.entry.id) { return; }
                    props.currentlyOpenDrawerID.value = null;
                }}
                renderRightActions={(_, dragValue) => {
                    return <SwipableButtonActions dragAnimatedValue={dragValue} onDeleteButtonPressed={() => {
                        (() => {
                            if (props.entry instanceof CartProductEntry){
                                return removeProductFromCart(props.entry.id);
                            } else {
                                return removeMealFromCart(props.entry.id);
                            }
                        })().catch(error => {
                            displayErrorMessage(error.message);
                        });
                    }}/>
                }}
            >
                <SpacerView space={15} style={styles.contentView}>
                    {productOrMeal instanceof Product &&
                        <ProductImageThumbnailView imageUrl={productOrMeal.imageUrl} />}
                    <SpacerView style={styles.center} space={9}>
                        <CustomizedText style={styles.title}>{productOrMeal.title}</CustomizedText>
                        <QuantityPickerView
                            increment={() => incrementOrDecrement(IncrememntOrDecrement.increment)}
                            decrement={() => incrementOrDecrement(IncrememntOrDecrement.decrement)}
                            value={quantity}
                        />
                    </SpacerView>
                    <SpacerView style={styles.rightSide} space={7}>
                        {quantity > 1 &&
                            <CustomizedText style={styles.quantityTimesPriceText}>{
                                quantity + " × " + currency(individualPrice).format()
                            }</CustomizedText>
                        }
                        <CustomizedText style={styles.totalPriceText}>{
                            currency(individualPrice * quantity).format()
                        }</CustomizedText>
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





