
import React from 'react';
import { StyleSheet } from 'react-native';
import { CustomFont } from '../../../helpers/fonts/fonts';
import HighlightButton from '../../../helpers/Buttons/HighlightView';
import CustomizedText from '../../../helpers/Views/CustomizedText';

export interface PlainTextListItemProps {
    title: string;
}

const PlainTextListItem = (() => {

    const styles = StyleSheet.create({
        root: {

        },
        listItem: {
            padding: 20,
        },
        listItemText: {
            fontSize: 16,
            fontFamily: CustomFont.medium,
        },
    });

    const PlainTextListItem = (props: PlainTextListItemProps) => {
        return <HighlightButton style={styles.listItem}>
            <CustomizedText style={styles.listItemText}>
                {props.title}
            </CustomizedText>
        </HighlightButton>
    }
    return PlainTextListItem;
})();

export default PlainTextListItem;
