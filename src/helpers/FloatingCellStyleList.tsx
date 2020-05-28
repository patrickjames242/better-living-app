

import React, { useCallback, useMemo } from 'react';
import { StyleSheet, SectionList, SectionListProps, View, SectionListData, SectionListRenderItemInfo} from 'react-native';
import LayoutConstants from '../LayoutConstants';
import MealCreatorConstants from '../TabBarController/Menu/MealCreaterScreen/MealCreatorConstants';
import CustomizedText from './CustomizedText';
import Space from './Spacers/Space';
import { Color } from './colors';
import { Optional } from './general';



export interface FloatingCellStyleListProps<ItemType, SectionType extends SectionListData<ItemType>> extends SectionListProps<ItemType> {
    sections: ReadonlyArray<SectionType>
    // if you return null, no header will be rendered for the section.
    titleForSection: (section: SectionType) => Optional<string>,
}

const FloatingCellStyleList = (() => {

    const styles = StyleSheet.create({
        sectionList: {
            overflow: 'visible',
            zIndex: -1,
        },
        contentContainer: {
            padding: LayoutConstants.pageSideInsets,
            paddingTop: LayoutConstants.floatingCellStyles.sectionSpacing,
            width: '100%',
            alignSelf: 'center',
            maxWidth: LayoutConstants.floatingCellStyles.maxWidth + (LayoutConstants.pageSideInsets * 2)
        },
        sectionListItemSeparatorLine: {
            height: StyleSheet.hairlineWidth * 1.5,
            backgroundColor: Color.gray(0.8).withAdjustedOpacity(0.4).stringValue,
        }
    });



    const FloatingCellStyleList = function <ItemType, SectionType extends SectionListData<ItemType>>(
        props: FloatingCellStyleListProps<ItemType, SectionType>
    ) {

        const titleForSection = props.titleForSection;

        const renderSectionHeader = useCallback((info: { section: SectionListData<ItemType> }) => {
            const title = titleForSection(info.section as SectionType);
            if (typeof title !== 'string'){return null;}
            return <MealCreatorListViewSectionHeader title={title} />
        }, [titleForSection]);

        const SectionSeparatorComponent = useCallback((args: any) => {

            const section = args.section as SectionType;

            const isBottomOfList = args.trailingItem == undefined && args.trailingSection == undefined;
            const isTopOfHeader = args.trailingItem == undefined;
            const isBottomOfHeader = args.leadingItem == undefined;

            const space = (() => {
                if (isBottomOfList || isBottomOfHeader && titleForSection(section) == null) {
                    return 0;
                } else if (isTopOfHeader) {
                    return MealCreatorConstants.foodSections.sectionSpacing;
                } else if (isBottomOfHeader) {
                    return MealCreatorConstants.foodSections.sectionHeaderBottomSpacing;
                } else { throw new Error("this point should not be reached!!!"); }
            })();
            return <Space space={space} />
        }, [titleForSection]);

        const ItemSeparatorComponent = useCallback(() => {
            return <View style={styles.sectionListItemSeparatorLine} />
        }, []);

        const propsRenderItem = props.renderItem;

        const renderItem = useMemo(() => {
            if (propsRenderItem == undefined) {
                return undefined;
            }
            return function renderItem(args: SectionListRenderItemInfo<ItemType>) {
                return <FloatingCellStylesItemView
                    isFirstInSection={args.index === 0}
                    isLastInSection={args.index === args.section.data.length - 1}
                >
                    {propsRenderItem(args)}
                </FloatingCellStylesItemView>
            }
        }, [propsRenderItem]);

        return <SectionList<ItemType>
            automaticallyAdjustContentInsets={false}
            contentInsetAdjustmentBehavior="never"
            stickySectionHeadersEnabled={false}
            renderSectionHeader={renderSectionHeader}
            SectionSeparatorComponent={SectionSeparatorComponent}
            ItemSeparatorComponent={ItemSeparatorComponent}
            {...props}
            // renderItem has to be below the user's props because it relies on the user's renderItem prop, which will override our implementation if we place this before
            renderItem={renderItem}
            style={[styles.sectionList, props.style]}
            contentContainerStyle={[styles.contentContainer, props.contentContainerStyle]}
        />
    }
    return FloatingCellStyleList;
})();

export default FloatingCellStyleList;








interface FloatingCellStyleListSectionHeaderProps {
    title: string,
}

const MealCreatorListViewSectionHeader = (() => {

    const styles = StyleSheet.create({
        root: {
            marginLeft: LayoutConstants.floatingCellStyles.borderRadius,
            ...LayoutConstants.floatingCellStyles.sectionHeaderTextStyles,
        },
    });

    const FloatingCellStyleListSectionHeader = (props: FloatingCellStyleListSectionHeaderProps) => {
        return <CustomizedText style={styles.root}>{props.title}</CustomizedText>
    }

    return FloatingCellStyleListSectionHeader;
})();








interface FloatingCellStylesItemViewProps {
    isFirstInSection: boolean,
    isLastInSection: boolean,
}

const FloatingCellStylesItemView = (() => {

    const styles = StyleSheet.create({
        root: {
            backgroundColor: 'white',
            overflow: 'hidden',
        },
    });

    const FloatingCellStylesItemView: React.FC<FloatingCellStylesItemViewProps> = props => {
        return <View style={[styles.root, {
            borderTopLeftRadius: props.isFirstInSection ? LayoutConstants.floatingCellStyles.borderRadius : 0,
            borderTopRightRadius: props.isFirstInSection ? LayoutConstants.floatingCellStyles.borderRadius : 0,
            borderBottomLeftRadius: props.isLastInSection ? LayoutConstants.floatingCellStyles.borderRadius : 0,
            borderBottomRightRadius: props.isLastInSection ? LayoutConstants.floatingCellStyles.borderRadius : 0,
        }]}>
            {props.children}
        </View>
    }
    return FloatingCellStylesItemView;
})();



