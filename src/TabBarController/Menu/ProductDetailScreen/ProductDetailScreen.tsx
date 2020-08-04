
import React, { useRef, useCallback, useLayoutEffect, useMemo } from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import NavigationControllerNavigationBar from '../../../helpers/NavigationController/NavigationControllerNavigationBar';
import { ScrollView } from 'react-native-gesture-handler';
import LayoutConstants from '../../../LayoutConstants';
import AspectRatioView from '../../../helpers/Views/AspectRatioView';
import { Optional, mapOptional } from '../../../helpers/general';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import { Color } from '../../../helpers/colors';
import Spacer from '../../../helpers/Spacers/Spacer';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import PurchaseOptionBox from './ChildComponents/PurchaseOptionBox';
import TitleBox from './ChildComponents/TitleBox';
import { useNotificationListener } from '../../../helpers/Notification';
import { windowDimensionsDidChangeNotification } from '../../helpers';
import { useNavigationScreenContext } from '../../../helpers/NavigationController/NavigationScreen';
import PresentableScreens from '../../../PresentableScreens';
import FloatingCellStyleSectionView from '../../../helpers/Views/FloatingCellStyleSectionView';
import { useSelector } from '../../../redux/store';
import ResourceNotFoundView from '../../../helpers/Views/ResourceNotFoundView';
import { useMealsForProduct } from '../../../api/orderingSystem/productsToMealsHelpers';
import currency from 'currency.js';

interface ProductDetailScreenProps {
    productId: number;
}

const ProductDetailScreen = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        scrollView: {
            zIndex: -1,
            overflow: 'visible',
        },
        scrollViewContentContainer: {
            padding: LayoutConstants.pageSideInsets,
        },
        scrollViewCenteredContent: {
            maxWidth: LayoutConstants.floatingCellStyles.maxWidth,
            width: '100%',
            alignSelf: 'center',
        },
        descriptionTextHolder: {
            backgroundColor: 'white',
            padding: LayoutConstants.floatingCellStyles.padding,
            ...LayoutConstants.floatingCellStyles.shadowConfig,
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
        },
        descriptionText: {
            lineHeight: 20,
            color: Color.gray(0.5).stringValue,
            fontSize: 15,
        },
    });

    return function ProductDetailScreen(props: ProductDetailScreenProps) {

        const product = useSelector(state => state.orderingSystem.products.get(props.productId));

        const navigationScreenContext = useNavigationScreenContext();

        function onMealButtonPressed() {
            mapOptional(PresentableScreens.MealCreatorScreen(), X => {
                navigationScreenContext.present(<X />);
            });
        }

        const meals = useMealsForProduct(props.productId);

        const productIndividualPrice = product?.individualPrice;

        const purchaseOptions = useMemo(() => {

            const allOptions = mapOptional(productIndividualPrice, price => [{
                title: "Purchase Separately",
                price: price,
                buttonText: 'Add to Cart',
            }]) ?? [];

            meals.forEach(meal => {
                allOptions.push({
                    title: meal.title,
                    price: meal.price,
                    buttonText: 'Create Meal'
                })
            });
            return allOptions;

        }, [meals, productIndividualPrice]);

        return <View style={styles.root}>
            <NavigationControllerNavigationBar title={product?.title ?? ""} />
            {(() => {
                if (product == null) {
                    return <ResourceNotFoundView />
                } else {
                    return <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContentContainer}>
                        <View style={styles.scrollViewCenteredContent}>
                            <Spacer space={LayoutConstants.floatingCellStyles.sectionSpacing}>
                                <SpacerView space={20}>
                                    {product.imageUrl && <FoodImageView imageUri={product.imageUrl} />}
                                    <TitleBox product={product} />
                                </SpacerView>

                                {product.description && <FloatingCellStyleSectionView sectionTitle="Description">
                                    <View style={styles.descriptionTextHolder}>
                                        <CustomizedText style={styles.descriptionText}>{product.description}</CustomizedText>
                                    </View>
                                </FloatingCellStyleSectionView>}
                                {purchaseOptions.length >= 1 &&
                                    <FloatingCellStyleSectionView sectionTitle="Purchase Options">
                                        {/* eslint-disable-next-line react/no-children-prop */}
                                        <SpacerView space={15} children={
                                            purchaseOptions.map((x, index) => <PurchaseOptionBox key={index} price={currency(x.price).format()} title={x.title} buttonText={x.buttonText} />)
                                        } />
                                    </FloatingCellStyleSectionView>}

                            </Spacer>
                        </View>
                    </ScrollView>
                }
            })()}

        </View>
    }
})();


export default ProductDetailScreen;

const FoodImageView = (() => {

    const styles = StyleSheet.create({

        imageHolder: {
            width: '100%',
            alignSelf: 'center',
            backgroundColor: 'white',
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            ...LayoutConstants.floatingCellStyles.shadowConfig,
        },
        image: {
            width: '100%',
            height: '100%',
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
        },
    });

    return function ProductImageView(props: { imageUri: string }) {

        const imageViewRef = useRef<View>(null);
        const previousMaxWidthValue = useRef<Optional<number>>(null);

        const adjustMaxSizeAccordingToWindowHeight = useCallback((windowHeight: number) => {
            const newMaxWidthValue = Math.max((windowHeight - 150) / LayoutConstants.productImageHeightPercentageOfWidth, 300);
            if (newMaxWidthValue === previousMaxWidthValue.current) { return; }
            imageViewRef.current?.setNativeProps({ style: { maxWidth: newMaxWidthValue } });
            previousMaxWidthValue.current = newMaxWidthValue;
        }, []);

        useLayoutEffect(() => adjustMaxSizeAccordingToWindowHeight(Dimensions.get('window').height), [adjustMaxSizeAccordingToWindowHeight]);

        useNotificationListener(windowDimensionsDidChangeNotification, (dimensions) => { adjustMaxSizeAccordingToWindowHeight(dimensions.height) });

        return <AspectRatioView ref={imageViewRef} style={styles.imageHolder} heightPercentageOfWidth={LayoutConstants.productImageHeightPercentageOfWidth}>
            <Image style={styles.image} source={{ uri: props.imageUri }} resizeMode={'cover'} />
        </AspectRatioView>

    }
})();





