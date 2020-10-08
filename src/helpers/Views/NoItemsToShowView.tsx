
import React from 'react';
import {Image, ImageStyle, StyleProp, StyleSheet, View} from 'react-native';
import AssetImages from '../../images/AssetImages';
import { CustomColors } from '../colors';
import { CustomFont } from '../fonts/fonts';
import Space from '../Spacers/Space';
import CustomizedText from './CustomizedText';

export interface NoItemsToShowViewProps{
    title?: string;
    subtitle?: string;
    imageSource?: any;
    imageStyle?: StyleProp<ImageStyle>
}

const NoItemsToShowView = (() => {
    
    const styles = StyleSheet.create({
        root: {
            flex: 1,
            justifyContent: 'center',
        },
        centerView: {
            alignItems: 'center',
        },
        iconImage: {
            height: 160,
            width: 160
        },
        title: {
            fontFamily: CustomFont.bold,
            fontSize: 22,
            textAlign: 'center',
            maxWidth: 190,
        },
        subtitle: {
            color: CustomColors.offBlackSubtitle.stringValue,
            fontFamily: CustomFont.medium,
            fontSize: 15,
            textAlign: 'center',
            maxWidth: 240,
            lineHeight: 20
        }
    });
    
    const NoItemsToShowView = (props: NoItemsToShowViewProps) => {
        return <View style={styles.root}>
            <View style={styles.centerView}>
                <Image style={[styles.iconImage, props.imageStyle]} source={props.imageSource ?? AssetImages.desertIcon} />
                <Space space={20}/>
                <CustomizedText style={styles.title}>{props.title ?? "No Items"}</CustomizedText>
                <Space space={8}/>
                <CustomizedText style={styles.subtitle}>{props.subtitle ?? "There are no items to show currently."}</CustomizedText>
            </View>
        </View>
    }
    return NoItemsToShowView;
})();

export default NoItemsToShowView;
