

import React, { useState } from 'react';
import LayoutConstants from '../LayoutConstants';
import { CustomFont } from '../helpers/fonts/fonts';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import CustomizedText from '../helpers/CustomizedText';
import BouncyButton from '../helpers/BouncyButton';
import { CustomColors, Color } from '../helpers/colors';
import { menuListSections } from './helpers';

const MenuListViewHeader = (() => {

    const styles = StyleSheet.create({
        root: {

        },
        topTitlesHolder: {
            marginTop: 30,
            marginLeft: LayoutConstants.menuPageSideInsets,
            marginRight: LayoutConstants.menuPageSideInsets,
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

    return function () {
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



const MenuCategoriesListView = (() => {

    const categories = [
        'All',
        ...menuListSections.map(x => x.title),
    ]

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
            paddingLeft: LayoutConstants.menuPageSideInsets,
            paddingRight: LayoutConstants.menuPageSideInsets,
        }
    })

    return function () {

        const [selectedItem, setSelectedItem] = useState(categories[0]);

        function onItemPress(text: string) {
            setSelectedItem(text);
        }

        return <View style={styles.root}>
            <FlatList
                showsHorizontalScrollIndicator={false}
                style={styles.listView}
                contentContainerStyle={styles.listViewContainer}
                horizontal
                ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                data={[...categories]} // without this, on the web, react doesn't check the children of the list for changes
                keyExtractor={(_, index) => String(index)}
                renderItem={({ item }) => {
                    return <MenuCategoriesListViewItem
                        text={item}
                        onPress={onItemPress}
                        isSelected={item === selectedItem} />
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
        root: (() => {
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

    return function (props: MenuCategoriesListViewItemProps) {
        return <BouncyButton
            bounceScaleValue={0.9}
            onPress={() => props.onPress(props.text)}
            style={[styles.root, {
                backgroundColor: props.isSelected ? CustomColors.themeGreen.stringValue : 'white',
                borderColor: props.isSelected ? 'transparent' : Color.gray(0.94).stringValue,
            }]}>
            <CustomizedText style={[styles.text, {
                color: props.isSelected ? 'white' : CustomColors.offBlackTitle.stringValue,
            }]}>{props.text}</CustomizedText>
        </BouncyButton>
    }

})();
