
import React, { useState, useMemo } from 'react';
import { StyleSheet, View, NativeSyntheticEvent, NativeScrollEvent, Dimensions, SectionList } from 'react-native';
import NavigationControllerNavigationBar from '../../../helpers/NavigationController/NavigationControllerNavigationBar';
import { listData, MealCreatorSection } from './helpers';
import LayoutConstants from '../../../LayoutConstants';
import MealCreatorConstants from './MealCreatorConstants';
import { useNavigationScreenContext } from '../../../helpers/NavigationController/NavigationScreen';
import MealCreatorScreenAddToCartButton from './ChildComponents/MealCreatorScreenAddToCartButton';
import CustomizedText from '../../../helpers/CustomizedText';
import MealCreatorListViewItem from './ChildComponents/MealCreatorListViewItem';
import { Map } from 'immutable';
import Space from '../../../helpers/Spacers/Space';
import { Color } from '../../../helpers/colors';


const MealCreatorScreen = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        sectionList: {
            overflow: 'visible',
            zIndex: -1,
        },
        flatListContentContainer: {
            padding: LayoutConstants.pageSideInsets,
            paddingTop: MealCreatorConstants.foodSections.sectionSpacing,
            paddingBottom: MealCreatorConstants.scrollViewBotomInset,
        },
        flatListItemSeparatorLine: {
            height: StyleSheet.hairlineWidth,
            backgroundColor: Color.gray(0.8).withAdjustedOpacity(0.4).stringValue,
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
        const [selectedItems, setSelectedItems] = useState(Map<number, number>());

        const initialNumToRender = useMemo(() => {
            return Math.ceil(Dimensions.get('window').height / MealCreatorConstants.foodSections.rowHeight);
        }, []);



        const sectionList = useMemo(() => {
            return <SectionList
                style={styles.sectionList}
                contentContainerStyle={styles.flatListContentContainer}
                sections={listData}
                stickySectionHeadersEnabled={false}
                renderSectionHeader={info => {
                    return <MealCreatorListViewSectionHeader title={(info.section as MealCreatorSection).title} />
                }}
                SectionSeparatorComponent={args => {
                    const isBottomOfList = args.trailingItem == undefined && args.trailingSection == undefined;
                    const isTopOfHeader = args.trailingItem == undefined;
                    const isBottomOfHeader = args.leadingItem == undefined;

                    const space = (() => {
                        if (isBottomOfList) {
                            return 0;
                        } else if (isTopOfHeader) {
                            return MealCreatorConstants.foodSections.sectionSpacing;
                        } else if (isBottomOfHeader) {
                            return MealCreatorConstants.foodSections.sectionHeaderBottomSpacing;
                        } else { throw new Error("this point should not be reached!!!"); }
                    })();
                    return <Space space={space} />
                }}
                ItemSeparatorComponent={() => {
                    return <View style={styles.flatListItemSeparatorLine} />
                }}
                onScroll={onScroll}
                renderItem={({ item, section, index }) => {
                    const _section = section = section as MealCreatorSection;
                    return <MealCreatorListViewItem
                        item={item}
                        isSelected={selectedItems.get(_section.id) === item.id}
                        isFirstInSection={index === 0}
                        isLastInSection={index === (_section.data.length - 1)}
                        onCheckMarkButtonPress={() => {
                            setSelectedItems(x => x.set(_section.id, item.id));
                        }}
                    />
                }}
                removeClippedSubviews
                initialNumToRender={initialNumToRender}
                windowSize={10}
            />

        }, [initialNumToRender, selectedItems]);


        return <View style={styles.root}>
            <NavigationControllerNavigationBar title="Large Plate" />
            {sectionList}
            <MealCreatorScreenAddToCartButton shouldGradientBeVisible={isScrollViewAtBottom === false} onPress={onAddToCartButtonPressed} />
        </View>
    }

    return MealCreatorScreen;

})();

export default React.memo(MealCreatorScreen);



interface MealCreatorListViewSectionHeaderProps {
    title: string,
}

const MealCreatorListViewSectionHeader = (() => {

    const styles = StyleSheet.create({
        root: {
            marginLeft: LayoutConstants.floatingCellStyles.borderRadius,
            ...LayoutConstants.floatingCellStyles.sectionHeaderTextStyles,
        },
    });

    const MealCreatorListViewSectionHeader = (props: MealCreatorListViewSectionHeaderProps) => {
        return <CustomizedText style={styles.root}>{props.title}</CustomizedText>
    }

    return MealCreatorListViewSectionHeader;
})();


