

import React from 'react';
import { StyleSheet, View, SectionList, SectionListProps } from 'react-native';
import LargeHeadingNavigationBar from '../../../helpers/NavigationBar/LargeHeadingNavigationBar';
import { SectionSeparatorComponentInfo, Optional } from '../../../helpers/general';
import LayoutConstants from '../../../LayoutConstants';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import Space from '../../../helpers/Spacers/Space';
import SettingsItemView, { SettingsItemViewProps } from './SettingsItemView';
import NavigationControllerNavigationBar from '../../../helpers/Views/NavigationControllerNavigationBar';


export interface GenericSettingsScreenSection{
    title: Optional<string>;
    data: SettingsItemViewProps[],
}

export enum GenericSettingsScreenNavigationBarType{
    mainScreenLargeTitle,
    regular,
}

export interface GenericSettingsScreenProps{
    navBarTitle: string;
    sections: GenericSettingsScreenSection[];
    sectionListProps?: Omit<SectionListProps<SettingsItemViewProps>, 'sections'>;
    navBarType?: GenericSettingsScreenNavigationBarType; // if not specific, defaults to regular
}


const GenericSettingsScreen = (() => {

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

    const GenericSettingsScreen = (props: GenericSettingsScreenProps) => {

        return <View style={styles.root}>
            {(() => {
                switch (props.navBarType){
                    case GenericSettingsScreenNavigationBarType.mainScreenLargeTitle:
                        return <LargeHeadingNavigationBar title={props.navBarTitle} />
                    default: 
                        return <NavigationControllerNavigationBar title={props.navBarTitle}/>
                }
            })()}
            
            <SectionList<SettingsItemViewProps>
                {...props.sectionListProps}
                stickySectionHeadersEnabled={false}
                style={[styles.sectionList, props.sectionListProps?.style]}
                contentContainerStyle={[styles.sectionListContentContainer, props.sectionListProps?.contentContainerStyle]}
                keyExtractor={ (_, index) => String(index)}
                renderSectionHeader={ args => {
                    if (args.section.title == null){return null;}
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
                ItemSeparatorComponent={() => <Space space={12.5}/>}
                sections={props.sections}
                renderItem={(args) => {
                    return <SettingsItemView {...args.item}/>
                }}
            />
        </View>
    }
    return GenericSettingsScreen;
})();

export default GenericSettingsScreen;

