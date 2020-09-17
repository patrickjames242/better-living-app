

import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import FloatingCellStyleList from '../../../helpers/Views/FloatingCellStyleList';
import CartItemListItemView from './CartItemLIstItemView';
import LargeHeadingNavigationBar from '../../../helpers/NavigationBar/LargeHeadingNavigationBar';
import LayoutConstants from '../../../LayoutConstants';
import ValueBox from '../../../helpers/ValueBox';
import { Optional } from '../../../helpers/general';
import { CartItemListTotalSummaryView } from './CartItemListTotalSummaryView';
import BottomScreenButtonWithGradient, { BottomScreenButtonWithGradientRef } from '../../../helpers/Views/BottomScreenButtonWithGradient';
import { CartNavStackParamList } from '../navigationHelpers';
import { StackScreenProps } from '@react-navigation/stack';
import { useSelector } from '../../../redux/store';
import { CartEntry } from '../../../redux/cart';



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
        data: CartEntry[],
    }

    const CartItemListScreen = (props: StackScreenProps<CartNavStackParamList, 'CartItemList'>) => {

        // the number refers to the id of the item
        const currentlyOpenDrawerID = useRef(new ValueBox<Optional<string>>(null)).current;
        const bottomGradientViewRef = useRef<BottomScreenButtonWithGradientRef>(null);
        const [bottomButtonHolderHeight, setBottomButtonHolderHeight] = useState(0);

        const cartEntriesMap = useSelector(state => state.cart);

        const sortedCartProductEntries = useMemo(() => {
            return cartEntriesMap.toSet().map(x => x.entry).sort((a, b) => {
                if (a.dateCreated.isBefore(b.dateCreated)){
                    return -1;
                } else if (a.dateCreated.isAfter(b.dateCreated)){
                    return 1;
                } else {return 0;}
            }).toArray();
        }, [cartEntriesMap]);

        const sections = useMemo(() => {
            return [{
                data: sortedCartProductEntries,
            }]
        }, [sortedCartProductEntries]);

        function onCheckOutButtonPressed() {
            props.navigation.push('OrderingConfirmation');
        }

        const listView = useMemo(() => {
            return <FloatingCellStyleList<CartEntry, Section>
                contentContainerStyle={[styles.listViewContent, { paddingBottom: bottomButtonHolderHeight + LayoutConstants.bottomScreenButtonWithGradient.bottomPadding }]}
                titleForSection={() => null}
                sections={sections}
                onScroll={event => {
                    bottomGradientViewRef.current?.gradientHolder?.notifyThatScrollViewScrolled(event);
                    currentlyOpenDrawerID.value = null
                }}
                keyExtractor={item => String(item.id)}
                ListFooterComponent={() => <>
                    <View style={styles.totalSummaryHolder}>
                        <CartItemListTotalSummaryView />
                    </View>
                </>
                }
                renderItem={({ item }) => {
                    return <CartItemListItemView entry={item} currentlyOpenDrawerID={currentlyOpenDrawerID} />
                }}
            />
        }, [bottomButtonHolderHeight, currentlyOpenDrawerID, sections]);



        return <View style={styles.root}>
            <LargeHeadingNavigationBar title="Your Cart" />
            {listView}
            <BottomScreenButtonWithGradient
                ref={bottomGradientViewRef}
                gradientHolderProps={{
                    onLayout: event => {
                        setBottomButtonHolderHeight(event.nativeEvent.layout.height);
                    }
                }}
                buttonProps={{
                    iconSource: require('../../TabBarController/TabBar/icons/shopping-cart.png'),
                    text: "Confirm Order",
                    onPress: onCheckOutButtonPressed,
                }}
            />
        </View>
    }
    return React.memo(CartItemListScreen);
})();



export default CartItemListScreen;





