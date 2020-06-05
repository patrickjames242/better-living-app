

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
import BottomScreenGradientHolder, { BottomScreenGradientHolderRef } from '../../../helpers/BottomScreenGradientHolder';
import CartItemListCheckOutButton from './CartItemListScreenFooter';
import { useNavigationScreenContext } from '../../../helpers/NavigationController/NavigationScreen';
import PresentableScreens from '../../../PresentableScreens';



const CartItemListScreen = (() => {

    const maxWidthForTotalSummaryAndBottomButton = 450;
    const bottomButtonTopAndBottomInsets = 15;

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        listViewContent: {
            paddingTop: LayoutConstants.pageSideInsets,
        },
        totalSummaryHolder: {
            marginTop: LayoutConstants.pageSideInsets,
            maxWidth: maxWidthForTotalSummaryAndBottomButton,
            width: '100%',
            alignSelf: 'center',
        },
        bottomButtonHolder: {
            paddingLeft: LayoutConstants.pageSideInsets,
            paddingRight: LayoutConstants.pageSideInsets,
            paddingBottom: bottomButtonTopAndBottomInsets,
        }
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
        const bottomGradientViewRef = useRef<BottomScreenGradientHolderRef>(null);
        const [bottomButtonHolderHeight, setBottomButtonHolderHeight] = useState(0);

        const navigationScreenContext = useNavigationScreenContext();

        function onCheckOutButtonPressed(){
            mapOptional(PresentableScreens.OrderConfirmationScreen(), Component => {
                navigationScreenContext.present(<Component/>);
            });
        }

        const listView = useMemo(() => {
            return <FloatingCellStyleList<MenuListItem, Section>
                
                contentContainerStyle={[styles.listViewContent, {paddingBottom: bottomButtonHolderHeight + bottomButtonTopAndBottomInsets}]}
                titleForSection={() => null}
                sections={sections}
                onScroll={event => {
                    bottomGradientViewRef.current?.notifyThatScrollViewScrolled(event);
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
            <BottomScreenGradientHolder ref={bottomGradientViewRef} style={styles.bottomButtonHolder} onLayout={event => {
                setBottomButtonHolderHeight(event.nativeEvent.layout.height);
            }}>
                <CartItemListCheckOutButton maxWidth={maxWidthForTotalSummaryAndBottomButton} onPress={onCheckOutButtonPressed} />
            </BottomScreenGradientHolder>
        </View>
    }
    return React.memo(CartItemListScreen);
})();



export default CartItemListScreen;





