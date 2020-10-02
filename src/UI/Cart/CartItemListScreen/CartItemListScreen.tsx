

import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import FloatingCellStyleList from '../../../helpers/Views/FloatingCellStyleList';
import CartItemListItemView from './CartItemLIstItemView';
import LargeHeadingNavigationBar from '../../../helpers/NavigationBar/LargeHeadingNavigationBar';
import LayoutConstants from '../../../LayoutConstants';
import ValueBox from '../../../helpers/ValueBox';
import { Optional } from '../../../helpers/general';
import CartTotalSummaryView from '../CartItemListTotalSummaryView';
import BottomScreenButtonWithGradient, { BottomScreenButtonWithGradientRef } from '../../../helpers/Views/BottomScreenButtonWithGradient';
import { CartNavStackParamList } from '../navigationHelpers';
import { StackScreenProps } from '@react-navigation/stack';
import { useSelector } from '../../../redux/store';
import { CartEntriesMapValue } from '../../../redux/cart';
import { CustomFont } from '../../../helpers/fonts/fonts';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import Space from '../../../helpers/Spacers/Space';
import { CustomColors } from '../../../helpers/colors';
import { checkOrderValidity, getRequestOrderItemsFromCartEntries } from '../../../api/orders/requests';
import { displayErrorMessage } from '../../../helpers/Alerts';



const CartItemListScreen = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        listViewContent: {
            paddingTop: LayoutConstants.pageSideInsets,
        },
        totalSummaryHolder: {
            marginTop: LayoutConstants.pageSideInsets,
            maxWidth: 500,
            width: '100%',
            alignSelf: 'center',
        },
    });


    interface Section {
        data: CartEntriesMapValue[],
    }

    const CartItemListScreen = (props: StackScreenProps<CartNavStackParamList, 'CartItemList'>) => {

        // the number refers to the id of the item
        const currentlyOpenDrawerID = useRef(new ValueBox<Optional<string>>(null)).current;
        const bottomGradientViewRef = useRef<BottomScreenButtonWithGradientRef>(null);
        const [bottomButtonHolderHeight, setBottomButtonHolderHeight] = useState(0);

        const cartEntriesMap = useSelector(state => state.cart);

        const sortedCartEntries = useMemo(() => {
            return cartEntriesMap.toSet().sort((a, b) => {
                if (a.entry.dateCreated.isBefore(b.entry.dateCreated)) {
                    return -1;
                } else if (a.entry.dateCreated.isAfter(b.entry.dateCreated)) {
                    return 1;
                } else { return 0; }
            }).toArray();
        }, [cartEntriesMap]);

        const sections = useMemo(() => {
            return [{
                data: sortedCartEntries,
            }]
        }, [sortedCartEntries]);

        const [validationIsLoading, setValidationIsLoading] = useState(false);

        function onCheckOutButtonPressed() {
            setValidationIsLoading(true);
            checkOrderValidity(getRequestOrderItemsFromCartEntries(sortedCartEntries))
                .finally(() => {
                    setValidationIsLoading(false);
                })
                .then(() => {
                    props.navigation.push('OrderingConfirmation', {cartEntries: sortedCartEntries});
                }).catch(error => {
                    displayErrorMessage(error.message);
                });
        }


        const listView = useMemo(() => {

            return <FloatingCellStyleList<CartEntriesMapValue, Section>
                contentContainerStyle={[styles.listViewContent, { paddingBottom: bottomButtonHolderHeight + LayoutConstants.bottomScreenButtonWithGradient.bottomPadding }]}
                titleForSection={() => null}
                sections={sections}
                onScroll={event => {
                    bottomGradientViewRef.current?.gradientHolder?.notifyThatScrollViewScrolled(event);
                    currentlyOpenDrawerID.value = null
                }}
                keyExtractor={item => String(item.entry.id)}
                ListFooterComponent={() => <>
                    <View style={styles.totalSummaryHolder}>
                        <CartTotalSummaryView entries={sortedCartEntries} />
                    </View>
                </>
                }
                renderItem={({ item }) => {
                    return <CartItemListItemView entry={item} currentlyOpenDrawerID={currentlyOpenDrawerID} />
                }}
            />
        }, [bottomButtonHolderHeight, currentlyOpenDrawerID, sections, sortedCartEntries]);


        return <View style={styles.root}>
            <LargeHeadingNavigationBar title="Your Cart" />
            {(() => {
                if (sortedCartEntries.length <= 0) {
                    return <CartIsEmptyView />
                } else {
                    return <>
                        {listView}
                        <BottomScreenButtonWithGradient
                            ref={bottomGradientViewRef}
                            gradientHolderProps={{
                                onLayout: event => {
                                    setBottomButtonHolderHeight(event.nativeEvent.layout.height);
                                },
                            }}
                            buttonProps={{
                                iconSource: require('../../TabBarController/icons/shopping-cart.png'),
                                text: "Confirm Order",
                                onPress: onCheckOutButtonPressed,
                                isLoading: validationIsLoading,
                            }}
                        />
                    </>
                }
            })()}
        </View>
    }
    return React.memo(CartItemListScreen);
})();


export default CartItemListScreen;




const CartIsEmptyView = (() => {

    const cartIconSize = 120;

    const styles = StyleSheet.create({
        root: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        centerContent: {
            alignItems: 'center',
        },
        cartIcon: {
            height: cartIconSize,
            width: cartIconSize,
            transform: [{ translateX: cartIconSize * -0.1 }]
        },
        titleText: {
            fontFamily: CustomFont.bold,
            fontSize: 22,
            textAlign: 'center',
            maxWidth: 170,
        },
        subtitleText: {
            color: CustomColors.offBlackSubtitle.stringValue,
            fontFamily: CustomFont.medium,
            fontSize: 15,
            textAlign: 'center',
            maxWidth: 200,
            lineHeight: 20
        }
    });

    const CartIsEmptyView = () => {
        return <View style={styles.root}>
            <View style={styles.centerContent}>
                <Image style={styles.cartIcon} source={require('./shopping-cart.png')} />
                <Space space={20} />
                <CustomizedText style={styles.titleText}>Empty Cart</CustomizedText>
                <Space space={9} />
                <CustomizedText style={styles.subtitleText}>{"Looks like you havn't made any choices yet"}</CustomizedText>
            </View>
        </View>
    }
    return CartIsEmptyView;
})();
