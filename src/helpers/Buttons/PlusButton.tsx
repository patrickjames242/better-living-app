import React from 'react';
import { CustomColors } from "../colors";
import BouncyButton from "./BouncyButton";
import AssetImages from "../../images/AssetImages";
import {StyleSheet, Image} from 'react-native';

export interface PlusButtonProps{
    onPress?: () => void;
}

const PlusButton = (() => {
    
    const styles = StyleSheet.create({
        root: {
            
        },
        buttonContentView: {

        },
        iconImage: {
            height: 20,
            width: 20,
            tintColor: CustomColors.themeGreen.stringValue,
            marginLeft: 5 ,
            marginRight: 5,
        },
    });
    
    const PlusButton = (props: PlusButtonProps) => {
        const hitSlopVal = 20;
        const hitSlop = {left: hitSlopVal, right: hitSlopVal, top: hitSlopVal, bottom: hitSlopVal};
        return <BouncyButton contentViewProps={{style: styles.buttonContentView}} style={styles.root} hitSlop={hitSlop} onPress={props.onPress}>
            <Image style={styles.iconImage} source={AssetImages.plusIcon}/>
        </BouncyButton>
    }
    return PlusButton;
})();

export default PlusButton;