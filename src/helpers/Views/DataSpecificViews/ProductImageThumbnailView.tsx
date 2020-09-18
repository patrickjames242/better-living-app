
import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import AssetImages from '../../../images/AssetImages';
import MealCreatorConstants from '../../../UI/Menu/MealCreaterScreen/MealCreatorConstants';
import { Color, CustomColors } from '../../colors';
import { getShadowStyle, Optional } from '../../general';
import AspectRatioView from '../AspectRatioView';

export interface ProductImageThumbnailViewProps{
    imageUrl: Optional<string>;
}

const ProductImageThumbnailView = (() => {
    const imageBorderRadius = 8;

    const styles = StyleSheet.create({
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
    });
    
    const ProductImageThumbnailView = (props: ProductImageThumbnailViewProps) => {
        return <AspectRatioView style={[styles.imageHolder, {
            ...(props.imageUrl ? getShadowStyle(10) : {}),
            backgroundColor: props.imageUrl ? 'white' : Color.gray(0.97).stringValue,
        }]} heightPercentageOfWidth={MealCreatorConstants.foodSections.imageHeightPercentageOfWidth}>
            {(() => {
                if (props.imageUrl){
                    return <Image style={styles.image} source={{uri: props.imageUrl}} resizeMode="cover" />
                } else {
                    return <View style={styles.noImageIconHolder}>
                        <Image style={styles.noImageIcon} source={AssetImages.imageIcon}/>
                    </View>
                }
            })()}
        </AspectRatioView>
    }
    return ProductImageThumbnailView;
})();

export default ProductImageThumbnailView;



