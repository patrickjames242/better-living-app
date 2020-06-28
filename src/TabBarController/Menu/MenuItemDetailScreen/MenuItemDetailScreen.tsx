
import React, { useRef, useCallback, useLayoutEffect } from 'react';
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


const MenuItemDetailScreen = (() => {

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

    return function MenuItemDetailScreen() {

        const navigationScreenContext = useNavigationScreenContext();

        function onMealButtonPressed(){
            mapOptional(PresentableScreens.MealCreatorScreen(), X => {
                navigationScreenContext.present(<X/>);
            });
        }

        return <View style={styles.root}>
            <NavigationControllerNavigationBar title="Pumpkin Soup" />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContentContainer}>
                <View style={styles.scrollViewCenteredContent}>
                    <Spacer space={LayoutConstants.floatingCellStyles.sectionSpacing}>
                        <SpacerView space={20}>
                            <FoodImageView />
                            <TitleBox />
                        </SpacerView>

                        <FloatingCellStyleSectionView sectionTitle="Description">
                            <View style={styles.descriptionTextHolder}>
                                <CustomizedText style={styles.descriptionText}>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia, ullam voluptate error tenetur eaque veniam deleniti quos, aut natus accusamus iusto pariatur facere est excepturi cum laboriosam ut totam perferendis repudiandae eum, eos quisquam provident? Odit quisquam odio vitae reiciendis ab, corporis minima laudantium natus ducimus ea deserunt amet nemo?
                            </CustomizedText>
                            </View>
                        </FloatingCellStyleSectionView>

                        <FloatingCellStyleSectionView sectionTitle="Purchase Options">
                            <SpacerView space={15}>
                                <PurchaseOptionBox price="$5.48" title="Purchase Separately" buttonText="Add To Cart" />
                                <PurchaseOptionBox price="$8.68" title="Small Plate" buttonText="Create Meal" onButtonPress={onMealButtonPressed}/>
                                <PurchaseOptionBox price="$11.92" title="Large Plate" buttonText="Create Meal" onButtonPress={onMealButtonPressed} />
                            </SpacerView>
                        </FloatingCellStyleSectionView>

                    </Spacer>
                </View>

            </ScrollView>
        </View>
    }
})();


export default MenuItemDetailScreen;

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

    return function ProductImageView() {

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
            <Image style={styles.image} source={require('../MenuListViewScreen/MenuListView/food-images/soup.jpg')} resizeMode={'cover'} />
        </AspectRatioView>

    }
})();





