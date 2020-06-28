


import React, { useState, useMemo, useRef } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import NavigationControllerNavigationBar from '../../../helpers/NavigationController/NavigationControllerNavigationBar';
import { listData, MealCreatorSection} from './helpers';
import MealCreatorConstants from './MealCreatorConstants';
import { useNavigationScreenContext } from '../../../helpers/NavigationController/NavigationScreen';
import MealCreatorScreenAddToCartButton from './ChildComponents/MealCreatorScreenAddToCartButton';
import MealCreatorListViewItem from './ChildComponents/MealCreatorListViewItem';
import { Map } from 'immutable';
import FloatingCellStyleList from '../../../helpers/Views/FloatingCellStyleList';
import ValueBox from '../../../helpers/ValueBox';
import { Optional } from '../../../helpers/general';
import { MenuListItem } from '../MenuListViewScreen/MenuListView/helpers';
import BottomScreenGradientHolder, { BottomScreenGradientHolderRef } from '../../../helpers/Views/BottomScreenGradientHolder';
import LayoutConstants from '../../../LayoutConstants';


const MealCreatorScreen = (() => {

    const bottomButtonTopAndBottomInsets = 15;

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        sectionList: {

        },
        bottomButtonHolder: {
            paddingLeft: LayoutConstants.pageSideInsets,
            paddingRight: LayoutConstants.pageSideInsets,
            paddingBottom: bottomButtonTopAndBottomInsets,
        }
    });


    const MealCreatorScreen = () => {

        const [bottomButtonViewHeight, setBottomButtonViewHeight] = useState(0);

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

        const bottomButtonHolderRef = useRef<BottomScreenGradientHolderRef>(null);

        const sectionList = useMemo(() => {
            
            return <FloatingCellStyleList<MenuListItem, MealCreatorSection>
                style={styles.sectionList}
                contentContainerStyle={{paddingBottom: bottomButtonViewHeight + bottomButtonTopAndBottomInsets}}
                sections={listData}
                titleForSection={section => section.title}                
                onScroll={event => bottomButtonHolderRef.current?.notifyThatScrollViewScrolled(event)}
                keyExtractor={item => String(item.id)}
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

        }, [bottomButtonViewHeight, initialNumToRender, selectedItemsForEachSection]);


        return <View style={styles.root}>
            <NavigationControllerNavigationBar title="Large Plate" />
            {sectionList}
            <BottomScreenGradientHolder style={styles.bottomButtonHolder} ref={bottomButtonHolderRef} onLayout={layout => {
                setBottomButtonViewHeight(layout.nativeEvent.layout.height);
            }}>
                <MealCreatorScreenAddToCartButton onPress={onAddToCartButtonPressed}/>
            </BottomScreenGradientHolder>
        </View>
    }

    return MealCreatorScreen;

})();

export default React.memo(MealCreatorScreen);

