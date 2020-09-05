
import React from 'react';
import { CustomColors } from "../colors";
import BouncyButton from "./BouncyButton";
import { StyleSheet, Image } from 'react-native';

export interface IconButtonProps {
    onPress?: () => void;
    iconSource: any;
    iconSize?: number;
}

const IconButton = (() => {

    const styles = StyleSheet.create({
        root: {

        },
        buttonContentView: {

        },
        iconImage: {
            tintColor: CustomColors.themeGreen.stringValue,
            // marginLeft: 5,
            // marginRight: 5,
        },
    });

    const hitSlopVal = 20;
    const hitSlop = { left: hitSlopVal, right: hitSlopVal, top: hitSlopVal, bottom: hitSlopVal };

    const IconButton = (props: IconButtonProps) => {
        
        const iconSize = props.iconSize ?? 20;
        
        return <BouncyButton
            contentViewProps={{ style: styles.buttonContentView }}
            style={styles.root}
            hitSlop={hitSlop}
            onPress={props.onPress}
        >
            <Image style={[styles.iconImage, {
                height: iconSize,
                width: iconSize,
            }]} source={props.iconSource} />
        </BouncyButton>
    }
    return IconButton;
})();

export default IconButton;
