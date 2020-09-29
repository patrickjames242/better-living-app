

import React, { useMemo } from 'react';
import LayoutConstants from '../../../../LayoutConstants';
import { CustomFont } from '../../../../helpers/fonts/fonts';
import { View, FlatList, StyleSheet } from 'react-native';
import CustomizedText from '../../../../helpers/Views/CustomizedText';
import BouncyButton from '../../../../helpers/Buttons/BouncyButton';
import { CustomColors, Color } from '../../../../helpers/colors';
import { useMenulistViewScreenContext, ALL_CATEGORIES_CATEGORY } from '../helpers';

interface MenuListViewHeader{
    
}

const MenuListViewHeader = (() => {

    const styles = StyleSheet.create({
        root: {

        },
        topTitlesHolder: {
            marginTop: 30,
            marginLeft: LayoutConstants.pageSideInsets,
            marginRight: LayoutConstants.pageSideInsets,
        },
        topTitles_topBoldTitle: {
            fontFamily: CustomFont.bold,
            fontSize: 33,
        },
        topTitles_subtitle: {
            marginTop: 7,
            fontSize: 20,
            color: CustomColors.offBlackSubtitle.stringValue,
        },
    });

    return function MenuListViewHeader(props: MenuListViewHeader) {
        return <View style={styles.root}>
            <View style={styles.topTitlesHolder}>
                <CustomizedText style={styles.topTitles_topBoldTitle}>Hello, Patrick</CustomizedText>
                <CustomizedText style={styles.topTitles_subtitle}>What would you like to eat?</CustomizedText>
            </View>
            <MenuCategoriesListView />
        </View>
    }
})();

export default MenuListViewHeader;

interface MenuCategoriesListViewProps{
    
}

const MenuCategoriesListView = (() => {

    const styles = StyleSheet.create({
        root: (() => {
            const topAndBottomInsets = 35;
            return {
                paddingTop: topAndBottomInsets,
                paddingBottom: topAndBottomInsets,
            }
        })(),
        listView: {

        },
        listViewContainer: {
            paddingLeft: LayoutConstants.pageSideInsets,
            paddingRight: LayoutConstants.pageSideInsets,
        }
    });



    return function MenuCategoriesListView() {

        const listViewContext = useMenulistViewScreenContext();

        const allCategories = useMemo(() => {
            return listViewContext.allSortedCategories.unshift(ALL_CATEGORIES_CATEGORY).toArray();
        }, [listViewContext.allSortedCategories]);

        return <View style={styles.root}>
            <FlatList
                showsHorizontalScrollIndicator={false}
                style={styles.listView}
                contentContainerStyle={styles.listViewContainer}
                horizontal
                ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                data={allCategories} // without this, on the web, react doesn't check the children of the list for changes
                keyExtractor={(_, index) => String(index)}
                renderItem={({ item }) => {
                    return <MenuCategoriesListViewItem
                        text={item.title}
                        onPress={() => listViewContext.setSelectedCategory(item)}
                        isSelected={item.title === listViewContext.selectedCategory.title} />
                }}
            />
        </View>
    }
})();


interface MenuCategoriesListViewItemProps {
    text: string,
    isSelected: boolean,
    onPress: (text: string) => void,
}

const MenuCategoriesListViewItem = (() => {

    const styles = StyleSheet.create({
        root: {

        },
        buttonContentView: (() => {
            const topAndBottomPadding = 10;
            const sidePadding = 15;
            return {
                borderRadius: 100000,
                padding: topAndBottomPadding,
                paddingLeft: sidePadding,
                paddingRight: sidePadding,
                borderWidth: 1,
            }
        })(),

        text: {
            fontFamily: CustomFont.bold,
            fontSize: 13,
        }
    });

    return function MenuCategoriesListViewItem(props: MenuCategoriesListViewItemProps) {
        return <BouncyButton
            bounceScaleValue={0.9}
            onPress={() => props.onPress(props.text)}
            contentViewProps={{
                style: [styles.buttonContentView, {
                    backgroundColor: props.isSelected ? CustomColors.themeGreen.stringValue : 'white',
                    borderColor: props.isSelected ? 'transparent' : Color.gray(0.94).stringValue,
                }]
            }}
        >
            <CustomizedText style={[styles.text, {
                color: props.isSelected ? 'white' : CustomColors.offBlackTitle.stringValue,
            }]}>{props.text}</CustomizedText>
        </BouncyButton>
    }

})();
