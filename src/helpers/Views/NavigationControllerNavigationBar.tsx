
import React from 'react';
import { StyleSheet, Image, ImageStyle } from 'react-native';
import CenteredTitleNavigationBar from '../NavigationBar/CenteredTitleNavigationBar';
import BouncyButton from '../Buttons/BouncyButton';
import { CustomColors } from '../colors';
import { useNavigation } from '@react-navigation/native';
import AssetImages from '../../images/AssetImages';


export interface NavigationControllerNavigationBarProps {
    title: string,
    rightAlignedView?: React.ReactElement,
}

const NavigationControllerNavigationBar = (() => {

    const styles = StyleSheet.create({
        backArrowButton: {
            padding: 4,
            paddingLeft: 6,
            paddingRight: 6,
        },
        backArrowImage: (() => {
            const size = 18;
            const styles: ImageStyle = {
                width: size,
                height: size,
                tintColor: CustomColors.themeGreen.stringValue,
            };
            return styles;
        })()
    });

    return function NavigationControllerNavigationBar(props: NavigationControllerNavigationBarProps) {


        const navigation = useNavigation();

        return <CenteredTitleNavigationBar
            title={props.title}
            rightAlignedView={props.rightAlignedView}
            leftAlignedView={
                <BouncyButton
                    onPress={() => navigation.goBack()}
                    style={styles.backArrowButton}
                    hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                >
                    <Image source={AssetImages.backArrowIcon} style={styles.backArrowImage} />
                </BouncyButton>
            }
        />
    }

})();

export default NavigationControllerNavigationBar;

