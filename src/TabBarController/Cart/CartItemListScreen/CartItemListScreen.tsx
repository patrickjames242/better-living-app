

import React, { useMemo } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { CustomColors, Color } from '../../../helpers/colors';
import FloatingCellStyleList from '../../../helpers/FloatingCellStyleList';
import { getRandomFoods, MenuListItem } from '../../Menu/MenuListViewScreen/MenuListView/helpers';
import CartItemListItemView from './CartItemLIstItemView';
import LargeHeadingNavigationBar from '../../../helpers/NavigationBar/LargeHeadingNavigationBar';
import LayoutConstants from '../../../LayoutConstants';
import CustomizedText from '../../../helpers/CustomizedText';
import { CustomFont } from '../../../helpers/fonts/fonts';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import BouncyButton from '../../../helpers/Buttons/BouncyButton';
import Spacer from '../../../helpers/Spacers/Spacer';



const CartItemListScreen = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        listViewContent: {
            paddingTop: LayoutConstants.pageSideInsets,
        },
    });

    interface Section {
        data: MenuListItem[],
    }

    const sections = [{
        data: getRandomFoods(5),
    }]

    const CartItemListScreen = () => {

        const listView = useMemo(() => {
            return <FloatingCellStyleList<MenuListItem, Section>
                contentContainerStyle={styles.listViewContent}
                titleForSection={() => null}
                sections={sections}
                renderItem={({ item }) => {
                    return <CartItemListItemView item={item} />
                }}
            />
        }, []);

        return <View style={styles.root}>
            <LargeHeadingNavigationBar title="Your Cart" />
            {listView}
            <CartItemListScreenFooter />
        </View>
    }
    return React.memo(CartItemListScreen);
})();

export default CartItemListScreen;







const CartItemListScreenFooter = (() => {

    const spacing = 15;

    const styles = StyleSheet.create({
        root: {
            backgroundColor: CustomColors.mainBackgroundColor.stringValue,
        },
        topLine: {
            height: StyleSheet.hairlineWidth,
            position: 'absolute',
            backgroundColor: Color.gray(0.8).stringValue,
            top: 0, right: 0, left: 0,
        },
        contentViewHolder: {
            paddingLeft: LayoutConstants.pageSideInsets,
            paddingRight: LayoutConstants.pageSideInsets,
            paddingTop: spacing,
            paddingBottom: spacing,
            maxWidth: LayoutConstants.floatingCellStyles.maxWidth + (LayoutConstants.pageSideInsets * 2),
            alignSelf: 'center',
            width: '100%',
        },
        contentView: {
            maxWidth: 450,
            width: '100%',
            alignSelf: 'center',
        },
    });

    const CartItemListScreenFooter = () => {
        return <View style={styles.root}>
            <View style={styles.contentViewHolder}>
                <View style={styles.topLine} />
                <View style={styles.contentView}>    
                    <Spacer space={spacing}>
                        <CartItemListTotalSummaryView />
                        <CartItemListCheckOutButton />
                    </Spacer>
                </View>
            </View>
            
        </View>
    }
    return CartItemListScreenFooter;
})();








const CartItemListTotalSummaryView = (() => {

    const styles = StyleSheet.create({
        root: {
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            padding: LayoutConstants.floatingCellStyles.padding,
            backgroundColor: 'white',
        },
        totalHolderBox: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        vatBoxText: {
            color: CustomColors.offBlackSubtitle.stringValue,
            fontFamily: CustomFont.medium,
            fontSize: 17,
        },
        totalText: {
            fontFamily: CustomFont.bold,
            fontSize: 21.5,
        },
        priceText: {
            fontFamily: CustomFont.bold,
            fontSize: 28,
            marginBottom: -4,
        }
    });

    const CartItemListTotalSummaryView = () => {
        return <SpacerView style={styles.root} space={10}>
            <View style={styles.totalHolderBox}>
                <CustomizedText style={styles.vatBoxText}>VAT:</CustomizedText>
                <CustomizedText style={styles.vatBoxText}>$1.53</CustomizedText>
            </View>
            <View style={styles.totalHolderBox}>
                <CustomizedText style={styles.totalText}>Total:</CustomizedText>
                <CustomizedText style={styles.priceText}>$11.24</CustomizedText>
            </View>
        </SpacerView>
    }
    return CartItemListTotalSummaryView;
})();





const CartItemListCheckOutButton = (() => {

    const styles = StyleSheet.create({
        root: {

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

    const CartItemListCheckOutButton = () => {
        return <BouncyButton style={styles.root} contentViewProps={{ style: styles.contentView }} bounceScaleValue={0.925}>
            <CustomizedText style={styles.confirmOrderText}>Confirm Order</CustomizedText>
            <View style={styles.cartIconHolder}>
                <Image style={styles.cartIcon} source={require('../../TabBar/icons/shopping-cart.png')} />
            </View>
        </BouncyButton>
    }

    return CartItemListCheckOutButton;
})();

