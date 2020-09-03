
import React, { useMemo } from 'react';
import { StyleSheet, View, SectionList } from 'react-native';
import NavigationControllerNavigationBar from '../../../helpers/Views/NavigationControllerNavigationBar';
import LayoutConstants from '../../../LayoutConstants';
import InquiryPostView from './InquiryPostView';
import { getNumbersList } from '../../../helpers/general';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import Space from '../../../helpers/Spacers/Space';



const InquiryDetailScreen = (() => {
    
    const verticalSpacing = 15;

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        sectionList: {
            overflow: 'visible',
            zIndex: -1,
        },
        sectionListHeader: {
            ...LayoutConstants.floatingCellStyles.sectionHeaderTextStyles,
            marginLeft: LayoutConstants.floatingCellStyles.borderRadius,
            marginTop: verticalSpacing * 1.75,
            marginBottom: verticalSpacing,
        },
        scrollViewContentContainer: {
            padding: LayoutConstants.pageSideInsets,
            maxWidth: LayoutConstants.floatingCellStyles.maxWidth + (LayoutConstants.pageSideInsets * 2),
            width: '100%',
            alignSelf: 'center',
        },
    });

    const InquiryDetailScreen = () => {

        const fakeSection = useMemo(() => [{ data: getNumbersList(1, 10) }], []);

        return <View style={styles.root}>
            <NavigationControllerNavigationBar title="The effectiveness of Neem soap" />
            <SectionList
                style={styles.sectionList}
                contentContainerStyle={styles.scrollViewContentContainer}
                ListHeaderComponent={
                    <InquiryPostView showsSubjectText />
                }
                sections={fakeSection}
                stickySectionHeadersEnabled={false}
                keyExtractor={item => String(item)}
                ItemSeparatorComponent={() => {
                    return <Space space={verticalSpacing}/>
                }}
                renderSectionHeader={() => {
                    return <CustomizedText style={styles.sectionListHeader}>Replies (10)</CustomizedText>
                }}
                renderItem={() => {
                    return <InquiryPostView showsSubjectText={false} />
                }}
            />
        </View>
    }
    return InquiryDetailScreen;
})();

export default InquiryDetailScreen;



