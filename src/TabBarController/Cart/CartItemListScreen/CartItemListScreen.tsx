

import React, { useMemo, useRef, useState} from 'react';
import { StyleSheet, View } from 'react-native';
import FloatingCellStyleList from '../../../helpers/FloatingCellStyleList';
import { getRandomFoods, MenuListItem } from '../../Menu/MenuListViewScreen/MenuListView/helpers';
import CartItemListItemView from './CartItemLIstItemView';
import LargeHeadingNavigationBar from '../../../helpers/NavigationBar/LargeHeadingNavigationBar';
import LayoutConstants from '../../../LayoutConstants';
import ValueBox from '../../../helpers/ValueBox';
import { Optional, mapOptional } from '../../../helpers/general';
import { CartItemListTotalSummaryView } from './CartItemListTotalSummaryView';
import { useNavigationScreenContext } from '../../../helpers/NavigationController/NavigationScreen';
import PresentableScreens from '../../../PresentableScreens';
import BottomScreenButtonWithGradient, { BottomScreenButtonWithGradientRef } from '../../../helpers/BottomScreenButtonWithGradient';



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
        data: MenuListItem[],
    }

    const sections = [{
        data: getRandomFoods(5),
    }];

    const CartItemListScreen = () => {

        // the number refers to the id of the item
        const currentlyOpenDrawerID = useRef(new ValueBox<Optional<number>>(null)).current;
        const bottomGradientViewRef = useRef<BottomScreenButtonWithGradientRef>(null);
        const [bottomButtonHolderHeight, setBottomButtonHolderHeight] = useState(0);

        const navigationScreenContext = useNavigationScreenContext();

        function onCheckOutButtonPressed(){
            mapOptional(PresentableScreens.OrderConfirmationScreen(), Component => {
                navigationScreenContext.present(<Component/>);
            });
        }

        const listView = useMemo(() => {
            return <FloatingCellStyleList<MenuListItem, Section>
                contentContainerStyle={[styles.listViewContent, {paddingBottom: bottomButtonHolderHeight + LayoutConstants.bottomScreenButtonWithGradient.bottomPadding}]}
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
                    return <CartItemListItemView item={item} currentlyOpenDrawerID={currentlyOpenDrawerID} />
                }}
            />
        }, [bottomButtonHolderHeight, currentlyOpenDrawerID]);



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
                    iconSource: require('../../TabBar/icons/shopping-cart.png'),
                    text: "Confirm Order",
                    onPress: onCheckOutButtonPressed,
                }}
            />
        </View>
    }
    return React.memo(CartItemListScreen);
})();



export default CartItemListScreen;





