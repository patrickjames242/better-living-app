
import React, { useState, useMemo } from 'react';
import { StyleSheet, View, FlatList, NativeSyntheticEvent, NativeScrollEvent, Dimensions } from 'react-native';
import NavigationControllerNavigationBar from '../../../helpers/NavigationController/NavigationControllerNavigationBar';
import MealCreatorSectionView from './ChildComponents/MealCreatorSectionView';
import { listData } from './helpers';
import LayoutConstants from '../../../LayoutConstants';
import Space from '../../../helpers/Spacers/Space';
import { CustomColors } from '../../../helpers/colors';
import BouncyButton from '../../../helpers/Buttons/BouncyButton';
import CustomizedText from '../../../helpers/CustomizedText';
import { getShadowStyle } from '../../../helpers/general';
import { CustomFont } from '../../../helpers/fonts/fonts';
import {LinearGradient} from 'expo-linear-gradient';
import { useSelector } from '../../../redux/store';
import { TabBarPosition } from '../../helpers';
import MealCreatorConstants from './MealCreatorConstants';




const MealCreatorScreen = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        flatList: {
            overflow: 'visible',
            zIndex: -1,
        },
        flatListContentContainer: {
            padding: LayoutConstants.pageSideInsets,
            paddingTop: MealCreatorConstants.foodSections.sectionSpacing,
            paddingBottom: MealCreatorConstants.scrollViewBotomInset,
        },
    });

    

    const MealCreatorScreen = () => {

        const initialNumToRender = useMemo(() => {

            let result = 0;

            let currentLength = 0;
            let remainingData = [...listData];
            const windowHeight = Dimensions.get('window').height;

            while (currentLength < windowHeight && remainingData.length >= 1){
                const nextElement = remainingData.splice(0, 2)[0];
                currentLength += MealCreatorConstants.foodSections.sectionHeight(nextElement.data.length);
                result += 1;
            }

            return result;
        }, []);

        const [isScrollViewAtBottom, setIsScrollViewAtBottom] = useState(false); 

        function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>){
            const isScrollViewAtBottom = (event.nativeEvent.contentOffset.y + event.nativeEvent.layoutMeasurement.height) >= (event.nativeEvent.contentSize.height -  10);
            setIsScrollViewAtBottom(isScrollViewAtBottom);
        }

        return <View style={styles.root}>
            <NavigationControllerNavigationBar title="Large Plate" />
            <FlatList
                ItemSeparatorComponent={() => <Space space={MealCreatorConstants.foodSections.sectionSpacing} />}
                contentContainerStyle={styles.flatListContentContainer}
                style={styles.flatList}
                data={listData}
                keyExtractor={(_, index) => String(index)}
                renderItem={({ item }) => <MealCreatorSectionView section={item} />}
                onScroll={onScroll}
                initialNumToRender={initialNumToRender}
                windowSize={5}
            />
            <AddToCartButton shouldGradientBeVisible={isScrollViewAtBottom === false}/>
        </View>
    }

    return MealCreatorScreen;

})();

export default MealCreatorScreen;




export interface AddToCartButtonProps {
    onPress?: () => void;
    shouldGradientBeVisible: boolean,
}

const AddToCartButton = (() => {


    const styles = StyleSheet.create({
        root: {
            position: 'absolute',
            bottom: 0,
            left: 0, right: 0,
            paddingLeft: LayoutConstants.pageSideInsets,
            paddingRight: LayoutConstants.pageSideInsets,
            paddingBottom: MealCreatorConstants.addToCartButton.bottomInset,
        },
        linearGradient: {
            position: 'absolute',
            left: 0, right: 0,
            top: -70,
            
        },
        button: {
            width: '100%',
            maxWidth: 400,
            alignSelf: 'center',
        },
        contentView: {
            backgroundColor: CustomColors.themeGreen.stringValue,
            borderRadius: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: MealCreatorConstants.addToCartButton.padding,
            paddingLeft: 18,
            paddingRight: 18,
            ...getShadowStyle(10),
        },
        text: {
            color: 'white',
            fontSize: MealCreatorConstants.addToCartButton.fontSize,
            fontFamily: CustomFont.bold,
        },
    });

    const AddToCartButton = (props: AddToCartButtonProps) => {

        const tabBarIsOnBottom = useSelector(state => state.tabBarController.tabBarPosition === TabBarPosition.bottom);

        return <View style={styles.root} pointerEvents="box-none">
            <LinearGradient 
                colors={[CustomColors.mainBackgroundColor.withAdjustedOpacity(0).stringValue, CustomColors.mainBackgroundColor.withAdjustedOpacity(1).stringValue]}
                start={[0.5, 0]}
                end={[0.5, 0.9]}
                style={[styles.linearGradient, {
                    opacity: props.shouldGradientBeVisible ? 1 : 0, 
                    bottom: tabBarIsOnBottom ? -LayoutConstants.navBar.cornerRadius : 0,
                }]}
                pointerEvents="none"
            />

            <BouncyButton style={styles.button} contentViewProps={{ style: styles.contentView }} onPress={props.onPress} bounceScaleValue={0.9}>
                <CustomizedText style={styles.text}>Add to Cart</CustomizedText>
                <CustomizedText style={styles.text}>$11.88</CustomizedText>
            </BouncyButton>
        </View>

    }
    return AddToCartButton;

})();




