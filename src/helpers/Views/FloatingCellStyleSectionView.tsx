import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import LayoutConstants from '../../LayoutConstants';
import SpacerView from '../Spacers/SpacerView';
import CustomizedText from './CustomizedText';

interface FloatingCellStyleSectionViewProps extends ViewProps {
  sectionTitle: string;
}

const FloatingCellStyleSectionView = (() => {
  const styles = StyleSheet.create({
    titleText: {
      ...LayoutConstants.floatingCellStyles.sectionHeaderTextStyles,
      marginLeft: LayoutConstants.floatingCellStyles.borderRadius,
    },
  });

  return function FloatingCellStyleSectionView(
    props: React.PropsWithChildren<FloatingCellStyleSectionViewProps>,
  ) {
    return (
      <SpacerView
        {...props}
        space={LayoutConstants.floatingCellStyles.sectionHeaderBottomSpacing}
      >
        <CustomizedText style={styles.titleText}>
          {props.sectionTitle}
        </CustomizedText>
        {props.children}
      </SpacerView>
    );
  };
})();

export default FloatingCellStyleSectionView;
