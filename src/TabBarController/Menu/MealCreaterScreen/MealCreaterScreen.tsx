
import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import NavigationControllerNavigationBar from '../../../helpers/NavigationController/NavigationControllerNavigationBar';
import MealCreatorSectionView from './ChildComponents/MealCreatorSection';
import { listData } from './helpers';
import LayoutConstants from '../../../LayoutConstants';
import Space from '../../../helpers/Spacers/Space';

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
            paddingTop: LayoutConstants.floatingCellStyles.sectionSpacing,
        },
    });

    const MealCreatorScreen = () => {
        return <View style={styles.root}>
            <NavigationControllerNavigationBar title="Large Plate" />
            <FlatList
                ItemSeparatorComponent={() => <Space space={LayoutConstants.floatingCellStyles.sectionSpacing}/>}
                contentContainerStyle={styles.flatListContentContainer}
                style={styles.flatList}
                data={listData}
                keyExtractor={item => item.title}
                renderItem={({ item }) => <MealCreatorSectionView section={item} />}
            />
        </View>
    }

    return MealCreatorScreen;

})();

export default MealCreatorScreen;
