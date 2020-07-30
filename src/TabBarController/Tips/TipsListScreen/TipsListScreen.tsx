
import React from 'react';
import { StyleSheet, View, LayoutRectangle } from 'react-native';
import LargeHeadingNavigationBar from '../../../helpers/NavigationBar/LargeHeadingNavigationBar';
import { computeNumberOfListColumns, mapOptional } from '../../../helpers/general';
import TipsListItemView from './TipsListItemView';
import LayoutConstants from '../../../LayoutConstants';
import Space from '../../../helpers/Spacers/Space';
import MultiColumnFlatList from '../../../helpers/Views/MultipleColumnLists/MultiColumnFlatList';
import { useAllHealthTipsArray } from '../../../api/healthTips/helpers';
import PlusButton from '../../../helpers/Buttons/PlusButton';
import PresentableScreens from '../../../PresentableScreens';
import { useNavigationScreenContext } from '../../../helpers/NavigationController/NavigationScreen';
import ResourceNotFoundView from '../../../helpers/Views/ResourceNotFoundView';


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

    function calculateListColumns(layout: LayoutRectangle){
        const num = computeNumberOfListColumns({listWidth: layout.width, sideInsets: listViewPadding, horizontalItemSpacing: itemSpacing, maxItemWidth: 600})
        return Math.min(num, 2);
    }    
    
    const TipsListScreen = () => {

        const healthTips = useAllHealthTipsArray();

        const navigationScreenContext = useNavigationScreenContext();

        function onPlusButtonPressed(){
            mapOptional(PresentableScreens.CreateOrEditTipScreen(), Component => navigationScreenContext.present(<Component tipIdToEdit={null}/>));
        }
        
        return <View style={styles.root}>
            <LargeHeadingNavigationBar title="Health Tips" rightAlignedView={<PlusButton onPress={onPlusButtonPressed}/>}/>
            <MultiColumnFlatList
                numberOfColumns={calculateListColumns}
                columnSpacing={itemSpacing}
                contentContainerStyle={styles.flatListContentContainer}
                style={styles.flatList}
                data={healthTips}
                ItemSeparatorComponent={() => {
                    return <Space space={itemSpacing} />
                }}
                keyExtractor={item => String(item)}
                renderItem={(item) => {
                    return <TipsListItemView id={item.id}/>
                }}
            />
        </View>
    }

    return TipsListScreen;
})();


export default TipsListScreen;



