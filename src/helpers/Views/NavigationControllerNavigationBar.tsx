
import React from 'react';
import { StyleSheet, Image, ImageStyle } from 'react-native';
import CenteredTitleNavigationBar from '../NavigationBar/CenteredTitleNavigationBar';
import BouncyButton from '../Buttons/BouncyButton';
import { CustomColors } from '../colors';
import { useNavigation } from '@react-navigation/native';
import AssetImages from '../../images/AssetImages';
import IconButton from '../Buttons/IconButton';


export interface NavigationControllerNavigationBarProps {
    title: string,
    rightAlignedView?: React.ReactElement,
}

const NavigationControllerNavigationBar = (() => {

    const styles = StyleSheet.create({
        // backArrowButton: {
        //     padding: 4,
        //     paddingLeft: 6,
        //     paddingRight: 6,
        // },
        // backArrowImage: (() => {
        //     const size = 18;
        //     const styles: ImageStyle = {
        //         width: size,
        //         height: size,
        //         tintColor: CustomColors.themeGreen.stringValue,
        //     };
        //     return styles;
        // })()
        iconButton: {
            marginLeft: 6,
            marginRight: 6,
        }
    });

    return function NavigationControllerNavigationBar(props: NavigationControllerNavigationBarProps) {

        const navigation = useNavigation();

        return <CenteredTitleNavigationBar
            title={props.title}
            rightAlignedView={props.rightAlignedView}
            leftAlignedView={
                <IconButton
                    iconSource={AssetImages.backArrowIcon}
                    iconSize={18}
                    onPress={() => navigation.goBack()}
                    style={styles.iconButton}
                />
            }
        />
    }

})();

export default NavigationControllerNavigationBar;
