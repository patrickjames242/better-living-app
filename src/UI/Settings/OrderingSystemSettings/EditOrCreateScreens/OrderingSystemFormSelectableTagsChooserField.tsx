
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextFieldViewContainer } from '../../../../helpers/Views/TextFieldView';
import SelectableRoundedTextButton, { SelectableRoundedTextButtonProps } from '../SelectableRoundedTextButton';
import { Set } from 'immutable';

const tagItemViewSpacing = 10;

export interface SelectableTagItem<IdType extends string | number>{
    id: IdType;
    title: string;
}

export interface OrderingSystemFormSelectableTagsChooserFieldProps<ItemIdType extends string | number> {
    containerTopTitleText: string;
    allSortedItems: SelectableTagItem<ItemIdType>[];
    selectedItemIds: Set<ItemIdType>;
    onSelectedItemsDidChange: (newIds: Set<ItemIdType>) => void;
}

const OrderingSystemFormSelectableTagsChooserField = (() => {


    const styles = StyleSheet.create({
        tagsHolder: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: -tagItemViewSpacing,
            marginRight: -tagItemViewSpacing,
        },
    });

    const OrderingSystemFormSelectableTagsChooserField = function<ItemIdType extends string | number>(props: OrderingSystemFormSelectableTagsChooserFieldProps<ItemIdType>){

        return <TextFieldViewContainer topTitleText={props.containerTopTitleText}>
            <View style={styles.tagsHolder}>
                {props.allSortedItems.map(item => {
                    return <TagItemView
                        key={item.id}
                        title={item.title}
                        isSelected={props.selectedItemIds.contains(item.id)}
                        onPress={() => { 
                            if (props.selectedItemIds.contains(item.id)){
                                props.onSelectedItemsDidChange(props.selectedItemIds.remove(item.id));
                            } else {
                                props.onSelectedItemsDidChange(props.selectedItemIds.add(item.id));
                            }
                        }}
                    />
                })}
            </View>
        </TextFieldViewContainer>
    }
    return OrderingSystemFormSelectableTagsChooserField;
})();

export default OrderingSystemFormSelectableTagsChooserField;



interface TagItemViewProps extends SelectableRoundedTextButtonProps { }

const TagItemView = (() => {

    const styles = StyleSheet.create({
        root: {
            marginBottom: tagItemViewSpacing,
            marginRight: tagItemViewSpacing,
        },
    });

    const InfoTagItemView = (props: TagItemViewProps) => {
        return <View style={styles.root}>
            <SelectableRoundedTextButton {...props}/>
        </View>
    }
    return InfoTagItemView;
})();

