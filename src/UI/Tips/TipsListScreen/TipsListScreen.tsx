
import React from 'react';
import { StyleSheet, View, LayoutRectangle } from 'react-native';
import LargeHeadingNavigationBar from '../../../helpers/NavigationBar/LargeHeadingNavigationBar';
import { computeNumberOfListColumns } from '../../../helpers/general';
import TipsListItemView from './TipsListItemView';
import LayoutConstants from '../../../LayoutConstants';
import Space from '../../../helpers/Spacers/Space';
import MultiColumnFlatList from '../../../helpers/Views/MultipleColumnLists/MultiColumnFlatList';
import { useAllHealthTipsArray } from '../../../api/healthTips/helpers';
import PlusButton from '../../../helpers/Buttons/PlusButton';
import { StackScreenProps } from '@react-navigation/stack';
import { TipsNavStackParamList } from '../navigationHelpers';
import ListLoadingHolderView from '../../../helpers/Views/ListLoadingView';
import NoItemsToShowView from '../../../helpers/Views/NoItemsToShowView';


const TipsListScreen = (() => {

    const listViewPadding = LayoutConstants.pageSideInsets;
    const itemSpacing = LayoutConstants.pageSideInsets;

    const styles = StyleSheet.create({
        root: {
            flex: 1,

        },
        flatList: {
            zIndex: -1,
            overflow: 'visible',
            flex: 1,
        },
        flatListContentContainer: {
            ...LayoutConstants.maxWidthListContentContainerStyles(1100),
        },
    });

    function calculateListColumns(layout: LayoutRectangle) {
        const num = computeNumberOfListColumns({ listWidth: layout.width, sideInsets: listViewPadding, horizontalItemSpacing: itemSpacing, maxItemWidth: 600 })
        return Math.min(num, 2);
    }

    const TipsListScreen = (props: StackScreenProps<TipsNavStackParamList, 'TipsList'>) => {

        const healthTips = useAllHealthTipsArray();

        function onPlusButtonPressed() {
            props.navigation.push('CreateOrEditTip', { tipIdToEdit: null });
        }

        return <View style={styles.root}>
            <LargeHeadingNavigationBar title="Health Tips" rightAlignedView={
                <PlusButton onPress={onPlusButtonPressed} />
            } />
            <ListLoadingHolderView>
                {(() => {
                    if (healthTips.length < 1) {
                        return <NoItemsToShowView title="No Tips" subtitle="No health tips are available at this time."/>
                    } else {
                        return <MultiColumnFlatList
                            contentContainerStyle={styles.flatListContentContainer}
                            numberOfColumns={calculateListColumns}
                            style={styles.flatList}
                            ItemSeparatorComponent={() => {
                                return <Space space={itemSpacing} />
                            }}
                            columnSpacing={itemSpacing}
                            data={healthTips}
                            keyExtractor={item => String(item)}
                            renderItem={(item) => {
                                return <TipsListItemView id={item.id} />
                            }}
                        />
                    }
                })()}
            </ListLoadingHolderView>
        </View>
    }

    return TipsListScreen;
})();


export default TipsListScreen;



