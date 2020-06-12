
import React from 'react';
import {StyleSheet, View, Image, LayoutRectangle } from 'react-native';
import LargeHeadingNavigationBar from '../../../helpers/NavigationBar/LargeHeadingNavigationBar';
import BouncyButton from '../../../helpers/Buttons/BouncyButton';
import { CustomColors } from '../../../helpers/colors';
import MultiColumnFlatList from '../../../helpers/MultipleColumnFlatList';
import InquiriesListItemView, { InquiryUnreadStatus } from './InquiriesListItemView';
import { getNumbersList, computeNumberOfListColumns } from '../../../helpers/general';
import LayoutConstants from '../../../LayoutConstants';
import Space from '../../../helpers/Spacers/Space';




const InquiriesListScreen = (() => {

    const itemSpacing = 15;
    const sideInsets = LayoutConstants.pageSideInsets;
    
    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        flatList: {
            zIndex: -1,
            overflow: 'visible',
        },
        flatListContentContainer: {
            padding: sideInsets,
        }
    });

    

    function calculateNumberOfColumns(layout: LayoutRectangle){
        return computeNumberOfListColumns({listWidth: layout.width, maxItemWidth: 350, sideInsets, horizontalItemSpacing: itemSpacing});
    }
    
    const InquiriesListScreen = () => {
        return <View style={styles.root}>
            <LargeHeadingNavigationBar title="Your Inquiries" rightAlignedView={<CreateNewInquiryButton/>}/>
            <MultiColumnFlatList
                contentContainerStyle={styles.flatListContentContainer}
                style={styles.flatList}
                ItemSeparatorComponent={() => <Space space={itemSpacing}/>}
                numberOfColumns={calculateNumberOfColumns}
                columnSpacing={itemSpacing}
                data={getNumbersList(1, 10)}
                keyExtractor={item => String(item)}
                renderItem={(_, index) => {
                    return <InquiriesListItemView unreadStatus={index === 0 ? InquiryUnreadStatus.unread : InquiryUnreadStatus.none}/>
                }}
            />
        </View>
    }
    return InquiriesListScreen;
})();

export default InquiriesListScreen;




const CreateNewInquiryButton = (() => {
    
    const styles = StyleSheet.create({
        root: {
            
        },
        buttonContentView: {

        },
        iconImage: {
            height: 20,
            width: 20,
            tintColor: CustomColors.themeGreen.stringValue,
            marginLeft: 5 ,
            marginRight: 5,
        },
    });
    
    const CreateNewInquiryButton = () => {
        const hitSlopVal = 20;
        const hitSlop = {left: hitSlopVal, right: hitSlopVal, top: hitSlopVal, bottom: hitSlopVal};
        return <BouncyButton contentViewProps={{style: styles.buttonContentView}} style={styles.root} hitSlop={hitSlop}>
            <Image style={styles.iconImage} source={require('./plus.png')}/>
        </BouncyButton>
    }
    return CreateNewInquiryButton;
})();



