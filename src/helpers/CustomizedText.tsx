

import React from 'react';

import { TextProps, Text, StyleSheet } from 'react-native';
import { CustomFont } from './fonts/fonts';
import { CustomColors } from './colors';


const CustomizedText: React.FC<TextProps> = (props) => {
    return <Text {...props} style={[styles.customizedText, props.style]}/>
}

export default CustomizedText;

const styles = StyleSheet.create({
    customizedText: {
        fontFamily: CustomFont.regular,
        color: CustomColors.offBlackTitle.stringValue,
    }
});

