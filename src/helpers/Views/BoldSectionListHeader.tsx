
import React from 'react';
import { StyleSheet } from 'react-native';
import { CustomFont } from '../fonts/fonts';
import CustomizedText from './CustomizedText';


const BoldSectionListHeader = (() => {

    const styles = StyleSheet.create({
        root: {
            fontFamily: CustomFont.bold,
        }
    });

    return function BoldSectionListHeader(props: { title: string, sideInsets: number, fontSize?: number }) {
        
        return <CustomizedText style={[styles.root, {
            marginLeft: props.sideInsets,
            marginRight: props.sideInsets,
            fontSize: props.fontSize ?? 23,
        }]}>
            {props.title}
        </CustomizedText>
    }
})();


export default BoldSectionListHeader;
