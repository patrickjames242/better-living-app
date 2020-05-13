
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { MenuListItem } from './helpers';
import BouncyButton from '../../../helpers/BouncyButton';
import CustomizedText from '../../../helpers/CustomizedText';
import { CustomFont } from '../../../helpers/fonts/fonts';
import { CustomColors } from '../../../helpers/colors';

const MenuListItemView = (() => {

    const borderRadius = 15;

    const shadowConfig = {
        shadowColor: 'black',
        shadowRadius: 20,
        shadowOpacity: 0.15
    }

    const styles = StyleSheet.create({
        root: {
            
        },
        imageHolderHolder: {
            paddingTop: '55%',
            overflow: 'hidden',
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
            ...shadowConfig,
            backgroundColor: 'white',
        },
        imageHolder: {
            ...StyleSheet.absoluteFillObject,
        },
        image: {
            width: '100%',
            height: '100%',
        },
        textBox: {
            backgroundColor: 'white',
            borderRadius: borderRadius,
            marginTop: -(borderRadius),
            padding: 15,
            ...shadowConfig,
            flexDirection: 'row',
            alignItems: 'center',
        },
        textBox_leftSide: {
            flexShrink: 1,
            flexGrow: 1,
        },
        textBox_productName: {
            fontSize: 18.5,
            fontFamily: CustomFont.bold,
        },
        textBox_productDescription: {
            fontSize: 13,
            color: CustomColors.offBlackSubtitle.stringValue,
            marginTop: 5,
        },
        textBox_rightSide: {
            marginLeft: 30,
        },
        priceText: {
            color: CustomColors.themeGreen.stringValue,
            fontFamily: CustomFont.bold,
            fontSize: 17,
        }
    });

    return function (props: { item: MenuListItem }) {
        return <BouncyButton style={styles.root} bounceScaleValue={0.93}>
            <View style={styles.imageHolderHolder}>
                <View style={styles.imageHolder}>
                    <Image style={styles.image} source={props.item.imageSource} resizeMode="cover" />
                </View>
            </View>
            <View style={styles.textBox}>
                <View style={styles.textBox_leftSide}>
                    <CustomizedText style={styles.textBox_productName} numberOfLines={2} ellipsizeMode={'tail'}>
                        {props.item.name}
                    </CustomizedText>
                    <CustomizedText style={styles.textBox_productDescription} numberOfLines={1} ellipsizeMode={'tail'}>
                        Lorem ipsum dolor sit amet conse adipi elit lorem ipsum dolor sit.
                    </CustomizedText>
                </View>
                <View style={styles.textBox_rightSide}>
                    <CustomizedText style={styles.priceText}>$7.88</CustomizedText>
                </View>
            </View>
        </BouncyButton>
    }
})();

export default MenuListItemView;