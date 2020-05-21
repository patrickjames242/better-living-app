
import React from 'react';
import { StyleSheet, Image, ImageStyle } from 'react-native';
import CenteredTitleNavigationBar from '../NavigationBar/CenteredTitleNavigationBar';
import BouncyButton from '../BouncyButton';
import { CustomColors } from '../colors';
import { useNavigationScreenContext } from './NavigationScreen';


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


        const screenContext = useNavigationScreenContext();

        return <CenteredTitleNavigationBar
            title={props.title}
            rightAlignedView={props.rightAlignedView}
            leftAlignedView={
                <BouncyButton
                    onPress={() => screenContext.dismiss()}
                    style={styles.backArrowButton}
                    hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                >
                    <Image source={require('./backArrow.png')} style={styles.backArrowImage} />
                </BouncyButton>
            }
        />
    }

})();

export default NavigationControllerNavigationBar;

