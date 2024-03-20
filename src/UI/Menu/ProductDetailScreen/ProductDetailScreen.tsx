import React, {
  useRef,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
  useContext,
} from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import NavigationControllerNavigationBar from '../../../helpers/Views/NavigationControllerNavigationBar';
import { ScrollView } from 'react-native-gesture-handler';
import LayoutConstants from '../../../LayoutConstants';
import AspectRatioView from '../../../helpers/Views/AspectRatioView';
import { Optional, mapOptional } from '../../../helpers/general';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import { Color } from '../../../helpers/colors';
import Spacer from '../../../helpers/Spacers/Spacer';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import PurchaseOptionBox, {
  PurchaseOptionBoxProps,
} from './ChildComponents/PurchaseOptionBox';
import TitleBox from './ChildComponents/TitleBox';
import { useNotificationListener } from '../../../helpers/Notification';
import {
  TabBarControllerContext,
  windowDimensionsDidChangeNotification,
} from '../../TabBarController/helpers';
import FloatingCellStyleSectionView from '../../../helpers/Views/FloatingCellStyleSectionView';
import { useSelector } from '../../../redux/store';
import ResourceNotFoundView from '../../../helpers/Views/ResourceNotFoundView';
import { useMealsForProduct } from '../../../api/orderingSystem/productsToMealsHelpers';
import currency from 'currency.js';
import { StackScreenProps } from '@react-navigation/stack';
import { MenuNavStackParams } from '../navigationHelpers';
import { CartProductEntry } from '../../../api/cart/CartProductEntry';
import { addProductToCart } from '../../../api/cart/requests';
import { displayErrorMessage } from '../../../helpers/Alerts';

const ProductDetailScreen = (() => {
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    scrollView: {
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

  return function ProductDetailScreen(
    props: StackScreenProps<MenuNavStackParams, 'ProductDetail'>,
  ) {
    const product = useSelector(state =>
      state.orderingSystem.products.get(props.route.params.productId),
    );
    const meals = useMealsForProduct(props.route.params.productId);
    const isUserLoggedIn = useSelector(state => state.authentication != null);
    const tabBarControllerContext = useContext(TabBarControllerContext);

    useLayoutEffect(() => {
      if (product == null) {
        props.navigation.goBack();
      }
    }, [product, props.navigation]);

    const allCartEntriesReduxState = useSelector(state => state.cart);

    const isProductInCart = useMemo(() => {
      return allCartEntriesReduxState.some(value => {
        if (value.entry instanceof CartProductEntry) {
          return value.entry.productId === product?.id;
        } else {
          return false;
        }
      });
    }, [allCartEntriesReduxState, product?.id]);

    const [addToCartIsLoading, setAddToCartIsLoading] = useState(false);

    const onPurchaseOptionButtonPressed = useCallback(
      (mealId: Optional<number>) => {
        if (isUserLoggedIn === false) {
          tabBarControllerContext?.presentLogInSignUpPopUp();
          return;
        }

        if (mealId == null) {
          if (!product) {
            return;
          }
          setAddToCartIsLoading(true);
          addProductToCart(product.id)
            .finally(() => {
              setAddToCartIsLoading(false);
            })
            .catch(error => {
              displayErrorMessage(error.message);
            });
        } else {
          props.navigation.push('MealCreator', {
            mealIdToCreateEntryFor: mealId,
            defaultSelectedProductId: product?.id,
          });
        }
      },
      [isUserLoggedIn, product, props.navigation, tabBarControllerContext],
    );

    const productIndividualPrice = product?.individualPrice;
    const shouldProductBeSoldIndividually = product?.shouldBeSoldIndividually;
    const productDescription = product?.description?.trim() ?? '';

    const purchaseOptions = useMemo(() => {
      const allOptions: PurchaseOptionBoxProps[] =
        mapOptional(
          shouldProductBeSoldIndividually ? productIndividualPrice : null,
          price => [
            {
              price: currency(price).format(),
              title: 'Purchase Separately',
              buttonText: addToCartIsLoading
                ? 'Adding...'
                : isProductInCart
                ? 'Added to Cart'
                : 'Add to Cart',
              onButtonPress: () => onPurchaseOptionButtonPressed(null),
              isButtonEnabled:
                isProductInCart === false && addToCartIsLoading === false,
            },
          ],
        ) ?? [];

      meals
        .sort((a, b) => {
          if (a.price === b.price) return 0;
          else if (a.price < b.price) return -1;
          else return 1;
        })
        .forEach(meal => {
          allOptions.push({
            price: currency(meal.price).format(),
            onButtonPress: () => onPurchaseOptionButtonPressed(meal.id),
            title: meal.title,
            buttonText: 'Create Meal',
          });
        });
      return allOptions;
    }, [
      addToCartIsLoading,
      isProductInCart,
      meals,
      onPurchaseOptionButtonPressed,
      productIndividualPrice,
      shouldProductBeSoldIndividually,
    ]);

    return (
      <View style={styles.root}>
        <NavigationControllerNavigationBar title={product?.title ?? ''} />
        {(() => {
          if (product == null) {
            return <ResourceNotFoundView />;
          } else {
            return (
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContentContainer}
              >
                <View style={styles.scrollViewCenteredContent}>
                  <Spacer
                    space={LayoutConstants.floatingCellStyles.sectionSpacing}
                  >
                    <SpacerView space={20}>
                      {product.imageUrl && (
                        <FoodImageView imageUri={product.imageUrl} />
                      )}
                      <TitleBox product={product} />
                    </SpacerView>
                    {productDescription.length >= 1 && (
                      <FloatingCellStyleSectionView sectionTitle="Description">
                        <View style={styles.descriptionTextHolder}>
                          <CustomizedText style={styles.descriptionText}>
                            {productDescription}
                          </CustomizedText>
                        </View>
                      </FloatingCellStyleSectionView>
                    )}
                    {purchaseOptions.length >= 1 && (
                      <FloatingCellStyleSectionView sectionTitle="Purchase Options">
                        <SpacerView
                          space={15}
                          /* eslint-disable-next-line react/no-children-prop */
                          children={purchaseOptions.map((x, index) => {
                            return <PurchaseOptionBox key={index} {...x} />;
                          })}
                        />
                      </FloatingCellStyleSectionView>
                    )}
                  </Spacer>
                </View>
              </ScrollView>
            );
          }
        })()}
      </View>
    );
  };
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

    const adjustMaxSizeAccordingToWindowHeight = useCallback(
      (windowHeight: number) => {
        const newMaxWidthValue = Math.max(
          (windowHeight - 150) /
            LayoutConstants.productImageHeightPercentageOfWidth,
          300,
        );
        if (newMaxWidthValue === previousMaxWidthValue.current) {
          return;
        }
        imageViewRef.current?.setNativeProps({
          style: { maxWidth: newMaxWidthValue },
        });
        previousMaxWidthValue.current = newMaxWidthValue;
      },
      [],
    );

    useLayoutEffect(
      () =>
        adjustMaxSizeAccordingToWindowHeight(Dimensions.get('window').height),
      [adjustMaxSizeAccordingToWindowHeight],
    );

    useNotificationListener(
      windowDimensionsDidChangeNotification,
      dimensions => {
        adjustMaxSizeAccordingToWindowHeight(dimensions.height);
      },
    );

    return (
      <AspectRatioView
        ref={imageViewRef}
        style={styles.imageHolder}
        heightPercentageOfWidth={
          LayoutConstants.productImageHeightPercentageOfWidth
        }
      >
        <Image
          style={styles.image}
          source={{ uri: props.imageUri }}
          resizeMode={'cover'}
        />
      </AspectRatioView>
    );
  };
})();
