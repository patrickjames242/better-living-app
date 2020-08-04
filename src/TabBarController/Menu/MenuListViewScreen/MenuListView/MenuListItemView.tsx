
import React, { useMemo } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import BouncyButton from '../../../../helpers/Buttons/BouncyButton';
import CustomizedText from '../../../../helpers/Views/CustomizedText';
import { CustomFont } from '../../../../helpers/fonts/fonts';
import { CustomColors, Color } from '../../../../helpers/colors';
import { useNavigationScreenContext } from '../../../../helpers/NavigationController/NavigationScreen';
import { mapOptional, compactMap } from '../../../../helpers/general';
import LayoutConstants from '../../../../LayoutConstants';
import AspectRatioView from '../../../../helpers/Views/AspectRatioView';
import PresentableScreens from '../../../../PresentableScreens';
import { useSelector } from '../../../../redux/store';
import { useMealsForProduct } from '../../../../api/orderingSystem/productsToMealsHelpers';
import currency from 'currency.js';


const MenuListItemView = (() => {

    const borderRadius = 15;

    // const shadowConfig = getShadowStyle(8);
    const shadowConfig = LayoutConstants.floatingCellStyles.shadowConfig;

    const styles = StyleSheet.create({
        root: {

        },
        imageHolder: {
            overflow: 'hidden',
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
            ...shadowConfig,
            backgroundColor: 'white',
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
            alignItems: 'flex-end',
        },
        startingAtText: {
            color: Color.gray(0.7).stringValue,
            fontSize: 13,
            marginBottom: 2,
        },
        priceText: {
            color: CustomColors.themeGreen.stringValue,
            fontFamily: CustomFont.bold,
            fontSize: 17,
        }
    });

    return function MenuListItemView(props: { productId: number }) {

        const product = useSelector(state => state.orderingSystem.products.get(props.productId));
        const description = product?.description;

        
        const mealsForProduct = useMealsForProduct(props.productId);

        const productIndividualPrice = product?.individualPrice;
        
        const cheapestPrice = useMemo(() => {
            const allPrices = productIndividualPrice ? [productIndividualPrice] : [];
            allPrices.push(...mealsForProduct.toArray().map(x => x.price));
            if (allPrices.length === 0){return null;}
            return Math.min(...allPrices);
        }, [mealsForProduct, productIndividualPrice]);

        
        const navigationScreenContext = useNavigationScreenContext();

        function onPress() {
            mapOptional(PresentableScreens.ProductDetailScreen(), X => {
                navigationScreenContext.present(<X productId={props.productId}/>)
            })
        }

        return <BouncyButton style={styles.root} bounceScaleValue={0.93} onPress={onPress}>

            <AspectRatioView
                heightPercentageOfWidth={LayoutConstants.productImageHeightPercentageOfWidth}
                style={styles.imageHolder}
            >
                <Image style={styles.image} source={{uri: product?.imageUrl ?? undefined}} resizeMode="cover" />
            </AspectRatioView>

            <View style={styles.textBox}>
                <View style={styles.textBox_leftSide}>
                    <CustomizedText style={styles.textBox_productName} numberOfLines={2} ellipsizeMode={'tail'}>
                        {product?.title}
                    </CustomizedText>
                    {description && 
                        <CustomizedText style={styles.textBox_productDescription} numberOfLines={1} ellipsizeMode={'tail'}>
                            {description}
                        </CustomizedText>}
                </View>
                {cheapestPrice && <View style={styles.textBox_rightSide}>
                    <CustomizedText style={styles.startingAtText}>from</CustomizedText>
                    <CustomizedText style={styles.priceText}>{currency(cheapestPrice).format()}</CustomizedText>
                </View>}
            </View>
        </BouncyButton>
    }
})();

export default MenuListItemView;


