
import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import LargeHeadingNavigationBar from '../../../helpers/NavigationBar/LargeHeadingNavigationBar';
import { getNumbersList, computeNumberOfListColumns } from '../../../helpers/general';
import TipsListItemView from './TipsListItemView';
import LayoutConstants from '../../../LayoutConstants';
import Space from '../../../helpers/Spacers/Space';
import MultiColumnFlatList from '../../../helpers/MultipleColumnFlatList';


const TipsListScreen = (() => {

    const listViewPadding = LayoutConstants.pageSideInsets;
    const itemSpacing = LayoutConstants.pageSideInsets;

    const styles = StyleSheet.create({
        root: {
            flex: 1,
            
        },
        flatList: {
            overflow: 'visible',
            zIndex: -1,
            flex: 1, 
            
        },
        flatListContentContainer: {
            alignSelf: 'center',
            width: '100%',
            maxWidth: 1100,
            padding: listViewPadding,
        },
    });

    function calculateListColumns(viewWidth: number){
        const num = computeNumberOfListColumns({listWidth: viewWidth, sideInsets: listViewPadding, horizontalItemSpacing: itemSpacing, maxItemWidth: 600})
        return Math.min(num, 2);
    }    
    
    const TipsListScreen = () => {

        const initialNumOfColumns = useMemo(() => calculateListColumns(Dimensions.get('window').width), []);
        const [numOfColumns, setNumOfColumns] = useState(initialNumOfColumns);

        return <View style={styles.root}>
            <LargeHeadingNavigationBar title="Health Tips" />
            <MultiColumnFlatList
                numberOfColumns={numOfColumns}
                columnSpacing={itemSpacing}
                onLayout={layout => setNumOfColumns(calculateListColumns(layout.nativeEvent.layout.width))}
                contentContainerStyle={styles.flatListContentContainer}
                style={styles.flatList}
                data={getNumbersList(1, 10)}
                ItemSeparatorComponent={() => {
                    return <Space space={itemSpacing} />
                }}
                keyExtractor={item => String(item)}
                renderItem={() => {
                    return <TipsListItemView />
                }}
            />
        </View>
    }

    return TipsListScreen;

})();


export default TipsListScreen;



