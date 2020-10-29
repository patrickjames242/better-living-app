
import React from 'react';
import { View, StyleSheet, Image, ViewStyle, ViewProps, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BouncyButton from '../../../helpers/Buttons/BouncyButton';
import { CustomColors, Color } from '../../../helpers/colors';
import LayoutConstants from '../../../LayoutConstants';
import { getInfoForTabBarSelection, TabBarSelection, useTabBarSelectionsForCurrentUser } from '../tabBarSelectionsHelpers';



interface BottomTabBarProps extends ViewProps{
    selectedTab: TabBarSelection;
    onTabPress: (selection: TabBarSelection) => void;
}

const iconSize = 28;

export default function BottomTabBar(props: BottomTabBarProps){

    const safeAreaInsets = useSafeAreaInsets();

    const currentTabBarSelections = useTabBarSelectionsForCurrentUser();

    return <View {...props} style={[tabBarStyles.tabBar, {
        paddingBottom: safeAreaInsets.bottom,
     }]}>
        <View style={tabBarStyles.contentView}>
            {currentTabBarSelections.map((selection, index) => {

                const isSelected = selection === props.selectedTab;
                const onPress = () => props.onTabPress(selection);
                const imageTintColor = (isSelected ? CustomColors.themeGreen : Color.gray(0.75));
                
                const info = getInfoForTabBarSelection(selection);

                return <BouncyButton key={index} style={tabBarStyles.tabBarButton} onPress={onPress} bounceScaleValue={1.3}>
                    {(() => {
                        switch (Platform.OS){
                            case 'web':
                                return <info.icons.svg color={imageTintColor} style={{width: iconSize, height: iconSize}}/>;
                            default:
                                return <Image resizeMode="contain" source={info.icons.png} style={[tabBarStyles.tabBarButtonImage, {tintColor: imageTintColor.stringValue}]}/>
                        }
                    })()}
                </BouncyButton>
            })}
        </View>
    </View>
}


const tabBarStyles = StyleSheet.create({
    tabBar: (() => {
        const borderRadius = LayoutConstants.navBar.cornerRadius;
        return {
            backgroundColor: 'white',
            borderTopLeftRadius: borderRadius, 
            borderTopRightRadius: borderRadius,
            ...LayoutConstants.navBar.shadowConfig,
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
        const size = iconSize;
        return {
            width: size,
            height: size,
        }
    })(),
})

