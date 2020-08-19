
import React from 'react';
import { getShadowStyle } from "../../general";
import { CustomFont } from "../../fonts/fonts";
import BouncyButton from "../../Buttons/BouncyButton";
import Spacer from "../../Spacers/Spacer";
import AspectRatioView from "../AspectRatioView";
import CustomizedText from "../CustomizedText";
import {StyleSheet, Image, ViewProps, View} from 'react-native';
import MealCreatorConstants from '../../../TabBarController/Menu/MealCreaterScreen/MealCreatorConstants';
import Product from '../../../api/orderingSystem/products/Product';
import LayoutConstants from '../../../LayoutConstants';
import AssetImages from '../../../images/AssetImages';
import { Color, CustomColors } from '../../colors';


export interface ListViewProductItemViewProps extends ViewProps {
    item: Product,
    onPress?: () => void,
}


const ListViewProductItemView = (() => {

    const imageBorderRadius = 8;

    const styles = StyleSheet.create({
        root: {
            flex: 1,
            padding: LayoutConstants.floatingCellStyles.padding,
            alignItems: 'flex-start',
        },
        contentView: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        imageHolder: {
            width: MealCreatorConstants.foodSections.imageWidth,
            borderRadius: imageBorderRadius,            
        },
        image: {
            width: '100%',
            height: '100%',
            borderRadius: imageBorderRadius,
        },
        noImageIconHolder:{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            opacity: 0.8,
        },
        noImageIcon: {
            height: 30,
            width: 30,
            tintColor: CustomColors.themeGreen.stringValue,
        },
        titleText: {
            fontFamily: CustomFont.medium,
            fontSize: MealCreatorConstants.foodSections.rowTitleFontSize,
            flexShrink: 1,
        },
    });

    const ListViewProductItemView = (props: ListViewProductItemViewProps) => {
        return <BouncyButton {...props} style={[styles.root, props.style]} bounceScaleValue={0.9} onPress={props.onPress} contentViewProps={{style: styles.contentView}}>
            <Spacer space={MealCreatorConstants.foodSections.contentViewPadding}>
                <AspectRatioView style={[styles.imageHolder, {
                    ...(props.item.imageUrl ? getShadowStyle(10) : {}),
                    backgroundColor: props.item.imageUrl ? 'white' : Color.gray(0.97).stringValue,
                }]} heightPercentageOfWidth={MealCreatorConstants.foodSections.imageHeightPercentageOfWidth}>
                    {(() => {
                        if (props.item.imageUrl){
                            return <Image style={styles.image} source={{uri: props.item.imageUrl}} resizeMode="cover" />
                        } else {
                            return <View style={styles.noImageIconHolder}>
                                <Image style={styles.noImageIcon} source={AssetImages.imageIcon}/>
                            </View>
                        }
                    })()}
                </AspectRatioView>
                <CustomizedText style={styles.titleText} numberOfLines={2}>{props.item.title}</CustomizedText>
            </Spacer>
        </BouncyButton>
    }
    return ListViewProductItemView;
})();


export default ListViewProductItemView;

