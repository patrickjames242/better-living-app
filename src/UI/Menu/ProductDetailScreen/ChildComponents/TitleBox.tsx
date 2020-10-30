
import React, { useMemo } from 'react';
import { StyleSheet, ImageStyle, Image, View } from 'react-native';
import SpacerView from '../../../../helpers/Spacers/SpacerView';
import LayoutConstants from '../../../../LayoutConstants';
import { CustomFont } from '../../../../helpers/fonts/fonts';
import { CustomColors } from '../../../../helpers/colors';
import CustomizedText from '../../../../helpers/Views/CustomizedText';
import { SpaceDimension } from '../../../../helpers/Spacers/Space';
import Product from '../../../../api/orderingSystem/products/Product';
import { useSelector } from '../../../../redux/store';
import { compactMap, caseInsensitiveStringSort } from '../../../../helpers/general';
import { useCurrentMenu } from '../../../../api/orderingSystem/menus/helpers';
import { List } from 'immutable';

const foodTagViewsSpacing = 10;

const TitleBox = (() => {



    const styles = StyleSheet.create({
        root: {
            backgroundColor: 'white',
            padding: LayoutConstants.floatingCellStyles.padding,
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            ...LayoutConstants.floatingCellStyles.shadowConfig,
        },
        titleText: {
            fontFamily: CustomFont.bold,
            fontSize: 25,
        },
        categoryBox: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        categoryIcon: (() => {
            const size = 16;
            const styles: ImageStyle = {
                width: size,
                height: size,
                // tintColor: CustomColors.offBlackSubtitle.stringValue,
            };
            return styles;
        })(),
        categoryText: {
            color: CustomColors.offBlackSubtitle.stringValue,
            fontSize: 18,
        },
        foodTagViewsHolder: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            marginBottom: -foodTagViewsSpacing,
        },
    });

    return function TitleBox(props: { product: Product }) {
        const allInfoTagsMap = useSelector(state => state.orderingSystem.productInfoTags);
        const currentMenu = useCurrentMenu();

        const categoryTitles = useMemo(() => {
            return (currentMenu?.categories.filter(x => x.productIds.contains(props.product.id)).map(x => x.title).sort(caseInsensitiveStringSort()) ?? List<string>());
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [currentMenu]);

        const infoTags = useMemo(() => {
            return compactMap(props.product.infoTagIds.toArray(), x => allInfoTagsMap.get(x)).sort(caseInsensitiveStringSort(x => x.title));
        }, [allInfoTagsMap, props.product.infoTagIds]);

        return <SpacerView style={styles.root} space={10}>
            <CustomizedText style={styles.titleText}>{props.product.title}</CustomizedText>
            {categoryTitles.size >= 1 &&
                <SpacerView style={styles.categoryBox} space={4} dimension={SpaceDimension.onlyHorizontal}>
                    <Image resizeMode="contain" style={styles.categoryIcon} source={require('./forkAndKnife.png')} />
                    <CustomizedText style={styles.categoryText}>{categoryTitles.join(' • ')}</CustomizedText>
                </SpacerView>}
            {infoTags.length >= 1 &&
                <SpacerView space={foodTagViewsSpacing} style={styles.foodTagViewsHolder}>
                    {infoTags.map(x => <FoodTagView key={x.id} title={x.title} />)}
                </SpacerView>}
        </SpacerView>
    }
})();


export default TitleBox;

const FoodTagView = (() => {

    const styles = StyleSheet.create({
        root: {
            padding: 5,
            paddingLeft: 8,
            paddingRight: 8,
            backgroundColor: CustomColors.themeGreen.stringValue,
            borderRadius: 5,
            marginBottom: foodTagViewsSpacing,
        },
        text: {
            color: 'white',
            fontSize: 13,
            fontFamily: CustomFont.medium,
        }
    });

    return function FoodTagView(props: { title: string }) {
        return <View style={styles.root}>
            <CustomizedText style={styles.text}>
                {props.title}
            </CustomizedText>
        </View>
    }

})();

