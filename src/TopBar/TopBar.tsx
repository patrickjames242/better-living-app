

import React from 'react';
import { View, StyleSheet, Text, Image, ViewStyle, ViewProps } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { CustomFont } from '../helpers/fonts/fonts';
import LayoutConstants from '../LayoutConstants';
import { CustomColors } from '../helpers/colors';
import CustomizedText from '../helpers/CustomizedText';


export default function TopBar(props: ViewProps) {

    const safeAreaInsets = useSafeArea();

    return <View {...props} style={[topBarStyles.topBar, {
        paddingTop: safeAreaInsets.top,
        marginLeft: safeAreaInsets.left,
        marginRight: safeAreaInsets.right,
    }]}>
        <View style={topBarStyles.contentView}>
            <CustomizedText style={topBarStyles.titleText}>Today's Menu</CustomizedText>
            <Image source={require('./profile-image.jpg')} style={topBarStyles.profileImage}/>
        </View>
    </View>
}

const topBarStyles = StyleSheet.create({
    topBar: (() => {
        const borderRadius = LayoutConstants.topAndBottomBarCornerRadius;
        return {
            backgroundColor: 'white',
            borderBottomLeftRadius: borderRadius, 
            borderBottomRightRadius: borderRadius,
            ...LayoutConstants.topAndBottomBarShadowConfig,
        } as ViewStyle
    })(),
    contentView: (() => {
        return {
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 13,
        } as ViewStyle
    })(),
    profileImage: (() => {
        const size = 32.5;
        return {
            width: size, height: size,
            borderRadius: size / 2,
        }
    })(),

    titleText: {
        fontFamily: CustomFont.bold,
        fontSize: 22,
        marginLeft: 6,
    }
    
});

