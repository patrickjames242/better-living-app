import React from 'react';
import {StyleSheet, Image} from 'react-native';
import { CustomFont } from '../fonts/fonts';
import RoundedBouncyButton from './RoundedBouncyButton';
import Space from '../Spacers/Space';
import CustomizedText from '../Views/CustomizedText';

export interface RoundedTextAndIconBouncyButtonProps{
    onPress?: () => void;
    iconSource: any;
    text: string;
}

const RoundedTextAndIconBouncyButton = (() => {
    
    const styles = StyleSheet.create({
        root: {
            alignSelf: 'flex-start',
        },
        contentView: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            paddingLeft: 15,
            paddingRight: 15,
        },
        iconImage: {
            height: 17.5,
            width: 17.5,
            // tintColor: 'white',
        },
        text: {
            fontFamily: CustomFont.medium,
            fontSize: 15,
            color: 'white',
        },
    });
    
    const RoundedTextAndIconBouncyButton = (props: RoundedTextAndIconBouncyButtonProps) => {
        return <RoundedBouncyButton style={styles.root} contentViewProps={{ style: styles.contentView }} onPress={props?.onPress}>
            <Image style={styles.iconImage} source={props.iconSource} />
            <Space space={10} />
            <CustomizedText style={styles.text}>{props.text}</CustomizedText>
        </RoundedBouncyButton>
    }
    return RoundedTextAndIconBouncyButton;
})();

export default RoundedTextAndIconBouncyButton;
