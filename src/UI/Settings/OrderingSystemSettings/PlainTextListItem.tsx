import React from 'react';
import { StyleSheet } from 'react-native';
import { CustomFont } from '../../../helpers/fonts/fonts';
import HighlightButton, {
  HighlightButtonProps,
} from '../../../helpers/Buttons/HighlightView';
import CustomizedText from '../../../helpers/Views/CustomizedText';

export interface PlainTextListItemProps extends HighlightButtonProps {
  title: string;
}

const PlainTextListItem = (() => {
  const styles = StyleSheet.create({
    root: {
      padding: 20,
    },
    listItemText: {
      fontSize: 16,
      fontFamily: CustomFont.medium,
    },
  });

  const PlainTextListItem = (props: PlainTextListItemProps) => {
    return (
      <HighlightButton {...props} style={[styles.root, props.style]}>
        <CustomizedText style={styles.listItemText}>
          {props.title}
        </CustomizedText>
      </HighlightButton>
    );
  };
  return PlainTextListItem;
})();

export default PlainTextListItem;
