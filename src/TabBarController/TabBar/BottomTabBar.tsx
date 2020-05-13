
import React from 'react';
import { View, StyleSheet, Image, ViewStyle, ViewProps } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import BouncyButton from '../../helpers/BouncyButton';
import { CustomColors, Color } from '../../helpers/colors';
import LayoutConstants from '../../LayoutConstants';
import { tabBarItemsData} from './helpers';
import { useTabBarControllerContext } from '../helpers';



export default function BottomTabBar(props: ViewProps){

    const safeAreaInsets = useSafeArea();

    const tabBarControllerContext = useTabBarControllerContext();

    return <View {...props} style={[tabBarStyles.tabBar, {
        paddingBottom: safeAreaInsets.bottom,
     }]}>
        <View style={tabBarStyles.contentView}>
            {tabBarItemsData.map((obj, index) => {

                const isSelected = obj.selection === tabBarControllerContext.currentSelection;
                const onPress = () => tabBarControllerContext.setCurrentSelection(obj.selection);
                const imageTintColor = (isSelected ? CustomColors.themeGreen : Color.gray(0.75)).stringValue;

                return <BouncyButton key={index} style={tabBarStyles.tabBarButton} onPress={onPress} bounceScaleValue={1.3}>
                    <Image source={obj.url} style={[tabBarStyles.tabBarButtonImage, {tintColor: imageTintColor}]}/>
                </BouncyButton>
            })}
        </View>
    </View>
}


const tabBarStyles = StyleSheet.create({
    tabBar: (() => {
        const borderRadius = LayoutConstants.menuPage.topAndBottomBarCornerRadius;
        return {
            backgroundColor: 'white',
            borderTopLeftRadius: borderRadius, 
            borderTopRightRadius: borderRadius,
            ...LayoutConstants.menuPage.topAndBottomBarShadowConfig,
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

