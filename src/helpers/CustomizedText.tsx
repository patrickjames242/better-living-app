

import React from 'react';

import { TextProps, Text, StyleSheet } from 'react-native';
import { CustomFont } from './fonts/fonts';
import { CustomColors } from './colors';

const CustomizedText: React.ForwardRefRenderFunction<Text, React.PropsWithChildren<TextProps>> = (props, ref) => {
    return <Text ref={ref} {...props} style={[styles.customizedText, props.style]}/>
}

export default React.forwardRef(CustomizedText);

const styles = StyleSheet.create({
    customizedText: {
        fontFamily: CustomFont.regular,
        color: CustomColors.offBlackTitle.stringValue,
    }
});



