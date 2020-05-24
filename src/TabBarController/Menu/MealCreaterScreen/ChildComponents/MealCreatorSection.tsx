

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CustomizedText from '../../../../helpers/CustomizedText';
import LayoutConstants from '../../../../LayoutConstants';
import { MealCreatorSection } from '../helpers';
import Spacer, { BaseSpacer } from '../../../../helpers/Spacers/Spacer';
import { Optional } from '../../../../helpers/general';
import { Color } from '../../../../helpers/colors';
import MealCreatorSelectionItem from './MealCreatorSelectionItem';



export interface MealCreatorSectionViewProps {
    section: MealCreatorSection,
}

const MealCreatorSectionView = (() => {

    const styles = StyleSheet.create({
        root: {

        },
        headerText: {
            ...LayoutConstants.floatingCellStyles.sectionHeaderTextStyles,
            marginLeft: LayoutConstants.floatingCellStyles.borderRadius,
        },
        sectionContentHolderHolderView: {
            ...LayoutConstants.floatingCellStyles.shadowConfig,
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            backgroundColor: 'white',
        },
        sectionContentHolderView: {
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            overflow: 'hidden',
        },
        itemSpacers: {
            height: StyleSheet.hairlineWidth,
            backgroundColor: Color.gray(0.8).withAdjustedOpacity(0.4).stringValue,
        },
    });

    console.warn("Animate changes in background color due to the selected item changing");

    const MealCreatorSectionView = (props: MealCreatorSectionViewProps) => {

        
        const [selectedIndex, setSelectedIndex] = useState<Optional<number>>(null);

        return <View style={styles.root}>
            <Spacer space={LayoutConstants.floatingCellStyles.sectionHeaderBottomSpacing}>
                <CustomizedText style={styles.headerText}>{props.section.title}</CustomizedText>
                <View style={styles.sectionContentHolderHolderView}>
                    <View style={styles.sectionContentHolderView}>
                        <BaseSpacer renderSpacer={() => {
                            return <View style={styles.itemSpacers} />
                        }}>
                            {props.section.data.map((item, index) => {
                                return <MealCreatorSelectionItem key={index} item={item} isSelected={selectedIndex === index} onCheckMarkButtonPress={() => {
                                    setSelectedIndex(index);
                                }} />
                            })}
                        </BaseSpacer>
                    </View>
                </View>

            </Spacer>
        </View>
    }

    return MealCreatorSectionView;
})();

export default MealCreatorSectionView;












