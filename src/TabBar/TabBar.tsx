
import React, { useState } from 'react';
import { View, StyleSheet, Image, ViewStyle, ViewProps } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import BouncyButton from '../helpers/BouncyButton';
import { CustomColors, Color } from '../helpers/colors';
import LayoutConstants from '../LayoutConstants';


export enum TabBarSelection {
    menu,
    cart,
    tips,
    contactRequests
}

export const tabBarItemsData: {
    url: any,
    selection: TabBarSelection,
}[] = [
    {
        selection: TabBarSelection.menu,
        url: require('./icons/food.png'),
    },
    {
        selection: TabBarSelection.cart,
        url: require('./icons/shopping-cart.png'),
    },
    {
        selection: TabBarSelection.tips,
        url: require('./icons/tips.png'),
    },
    {
        selection: TabBarSelection.contactRequests,
        url: require('./icons/contact-requests.png'),
    },
]


export default function TabBar(props: ViewProps){

    const safeAreaInsets = useSafeArea();

    const [currentSelection, setCurrentSelection] = useState(TabBarSelection.menu);

    return <View {...props} style={[tabBarStyles.tabBar, {
        paddingBottom: safeAreaInsets.bottom, 
        marginLeft: safeAreaInsets.left, 
        marginRight: safeAreaInsets.right
     }]}>
        <View style={tabBarStyles.contentView}>
            {tabBarItemsData.map((obj, index) => {

                const isSelected = obj.selection === currentSelection;
                const onPress = () => setCurrentSelection(obj.selection);
                const imageTintColor = (isSelected ? CustomColors.themeGreen : Color.gray(0.75)).stringValue;

                return <BouncyButton key={index} style={tabBarStyles.tabBarButton} onPress={onPress}>
                    <Image source={obj.url} style={[tabBarStyles.tabBarButtonImage, {tintColor: imageTintColor}]}/>
                </BouncyButton>
            })}
        </View>
    </View>
}


const tabBarStyles = StyleSheet.create({
    tabBar: (() => {
        const borderRadius = LayoutConstants.topAndBottomBarCornerRadius;
        return {
            backgroundColor: 'white',
            borderTopLeftRadius: borderRadius, 
            borderTopRightRadius: borderRadius,
            ...LayoutConstants.topAndBottomBarShadowConfig,
        } as ViewStyle;
    })(),
    contentView: {
        flexDirection: 'row',
    },
    tabBarButton: (() => {
        const topAndBottomPadding = 14;
        return {
            paddingTop: topAndBottomPadding,
            paddingBottom: topAndBottomPadding,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        } as ViewStyle;
    })(),
    tabBarButtonImage: (() => {
        const size = 28;
        return {
            width: size,
            height: size,            
        }
    })(),
})

