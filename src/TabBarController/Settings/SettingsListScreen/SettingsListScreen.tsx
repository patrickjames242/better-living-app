
import React from 'react';
import { StyleSheet, View, SectionList } from 'react-native';
import LargeHeadingNavigationBar from '../../../helpers/NavigationBar/LargeHeadingNavigationBar';
import SettingsListScreenHeader from './SettingsListScreenHeader';
import { getNumbersList, SectionSeparatorComponentInfo } from '../../../helpers/general';
import SettingsListItemView from './SettingsListItemView';
import LayoutConstants from '../../../LayoutConstants';
import CustomizedText from '../../../helpers/CustomizedText';
import Space from '../../../helpers/Spacers/Space';



export interface SettingsListScreenProps {

}

const SettingsListScreen = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        sectionList: {
            overflow: 'visible',
            zIndex: -1,
        },
        sectionListContentContainer: {
            paddingLeft: LayoutConstants.pageSideInsets,
            paddingRight: LayoutConstants.pageSideInsets,
            paddingBottom: LayoutConstants.pageSideInsets,
            maxWidth: LayoutConstants.floatingCellStyles.maxWidth + (LayoutConstants.pageSideInsets * 2),
            alignSelf: 'center',
            width: '100%',
        },
        sectionHeader: {
          marginLeft: LayoutConstants.floatingCellStyles.borderRadius,
          ...LayoutConstants.floatingCellStyles.sectionHeaderTextStyles,  
        },
    });

    const sectionLength = 3;

    const fakeSections = [undefined, 'General', 'Configuration'].map((item, index) => {
        
        const startIndex = index * sectionLength;
        const endIndex = startIndex + (sectionLength - 1);

        return {
            title: item,
            data: getNumbersList(startIndex, endIndex),
        }
    })

    const SettingsListScreen = (props: SettingsListScreenProps) => {
        return <View style={styles.root}>
            <LargeHeadingNavigationBar title="Settings" />
            <SectionList
                stickySectionHeadersEnabled={false}
                style={styles.sectionList}
                contentContainerStyle={styles.sectionListContentContainer}
                ListHeaderComponent={() => {
                    return <SettingsListScreenHeader />
                }}
                keyExtractor={ item => String(item)}
                renderSectionHeader={ args => {
                    if (args.section.title == undefined){return null;}
                    return <CustomizedText style={styles.sectionHeader}>{args.section.title}</CustomizedText>
                }}
                SectionSeparatorComponent={(args: SectionSeparatorComponentInfo) => {
                    const spaceSize = (() => {
                        if (args.leadingItem != null && args.trailingSection != null){
                            return LayoutConstants.floatingCellStyles.sectionSpacing;
                        } else if (args.trailingItem != null){
                            return LayoutConstants.floatingCellStyles.sectionHeaderBottomSpacing;
                        } else {
                            return null;
                        }
                    })();
                    return (spaceSize != null) ? <Space space={spaceSize}/> : null;
                }}
                ItemSeparatorComponent={() => <Space space={15}/>}
                sections={fakeSections}
                renderItem={() => {
                    return <SettingsListItemView />
                }}
            />
        </View>
    }
    return SettingsListScreen;
})();

export default SettingsListScreen;

