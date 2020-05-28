
import React, { useState, useMemo } from 'react';
import { StyleSheet, View, NativeSyntheticEvent, NativeScrollEvent, Dimensions } from 'react-native';
import NavigationControllerNavigationBar from '../../../helpers/NavigationController/NavigationControllerNavigationBar';
import { listData, MealCreatorSection, MealCreatorListItem } from './helpers';
import MealCreatorConstants from './MealCreatorConstants';
import { useNavigationScreenContext } from '../../../helpers/NavigationController/NavigationScreen';
import MealCreatorScreenAddToCartButton from './ChildComponents/MealCreatorScreenAddToCartButton';
import MealCreatorListViewItem from './ChildComponents/MealCreatorListViewItem';
import { Map } from 'immutable';
import FloatingCellStyleList from '../../../helpers/FloatingCellStyleList';
import ValueBox from '../../../helpers/ValueBox';
import { Optional } from '../../../helpers/general';


const MealCreatorScreen = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        sectionList: {

        },
        flatListContentContainer: {
            paddingBottom: MealCreatorConstants.scrollViewBotomInset,
        },
    });



    const MealCreatorScreen = () => {

        const [isScrollViewAtBottom, setIsScrollViewAtBottom] = useState(false);

        function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
            const isScrollViewAtBottom = (event.nativeEvent.contentOffset.y + event.nativeEvent.layoutMeasurement.height) >= (event.nativeEvent.contentSize.height - 10);
            setIsScrollViewAtBottom(isScrollViewAtBottom);
        }

        const navigationScreenContext = useNavigationScreenContext();

        function onAddToCartButtonPressed() {
            navigationScreenContext.dismissToRoot();
        }

        // key is the section id. value is the item id.
        const selectedItemsForEachSection = useMemo(() => {
            return Map<number, ValueBox<Optional<number>>>().withMutations(mutable => {
                listData.forEach(x => {
                    mutable.set(x.id, new ValueBox<Optional<number>>(null));
                });
            });
        }, []);

        const initialNumToRender = useMemo(() => {
            return Math.ceil(Dimensions.get('window').height / MealCreatorConstants.foodSections.rowHeight);
        }, []);

        const sectionList = useMemo(() => {
            
            return <FloatingCellStyleList<MealCreatorListItem, MealCreatorSection>
                style={styles.sectionList}
                contentContainerStyle={styles.flatListContentContainer}
                sections={listData}
                titleForSection={section => section.title}                
                onScroll={onScroll}
                renderItem={({ item, section }) => {
                    const _section = section = section as MealCreatorSection;
                    return <MealCreatorListViewItem
                        item={item}
                        sectionSelectionValue={selectedItemsForEachSection.get(_section.id)!}
                    />
                }}
                initialNumToRender={initialNumToRender}
                windowSize={10}
            />

        }, [initialNumToRender, selectedItemsForEachSection]);


        return <View style={styles.root}>
            <NavigationControllerNavigationBar title="Large Plate" />
            {sectionList}
            <MealCreatorScreenAddToCartButton shouldGradientBeVisible={isScrollViewAtBottom === false} onPress={onAddToCartButtonPressed} />
        </View>
    }

    return MealCreatorScreen;

})();

export default React.memo(MealCreatorScreen);

