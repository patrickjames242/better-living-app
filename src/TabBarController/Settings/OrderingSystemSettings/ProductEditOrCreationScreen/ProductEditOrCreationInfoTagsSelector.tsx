
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextFieldViewContainer } from '../../../../helpers/Views/TextFieldView';
import { Set } from 'immutable';
import { useSelector } from '../../../../redux/store';
import SelectableRoundedTextButton, { SelectableRoundedTextButtonProps } from '../SelectableRoundedTextButton';
import { useField } from '../../../../helpers/formik';
import { ProductEditOrCreateValues } from './helpers';
import { caseInsensitiveStringSort } from '../../../../helpers/general';

const infoTagViewSpacing = 10;

export interface ProductEditOrCreationInfoTagsSelectorProps {

}

const ProductEditOrCreationInfoTagsSelector = (() => {


    const styles = StyleSheet.create({
        tagsHolder: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: -infoTagViewSpacing,
            marginRight: -infoTagViewSpacing,
        },
    });

    function useSortedInfoTags() {
        const infoTagsReduxState = useSelector(state => state.orderingSystem.productInfoTags);
        return useMemo(() => {
            return infoTagsReduxState.toSet().sort(caseInsensitiveStringSort(x => x.title)).toArray();
        }, [infoTagsReduxState]);
    }

    const ProductEditOrCreationInfoTagsSelector = (props: ProductEditOrCreationInfoTagsSelectorProps) => {

        const infoTags = useSortedInfoTags();

        const [,{value}, {setValue}] = useField<ProductEditOrCreateValues, 'infoTagIds'>('infoTagIds');

        return <TextFieldViewContainer topTitleText="Info Tags">
            <View style={styles.tagsHolder}>
                {infoTags.map(tag => {
                    return <InfoTagItemView
                        key={tag.id}
                        title={tag.title}
                        isSelected={value.contains(tag.id)}
                        onPress={() => { 
                            if (value.contains(tag.id)){
                                setValue(value.remove(tag.id));
                            } else {
                                setValue(value.add(tag.id));
                            }
                        }}
                    />
                })}
            </View>
        </TextFieldViewContainer>
    }
    return ProductEditOrCreationInfoTagsSelector;
})();

export default ProductEditOrCreationInfoTagsSelector;



interface InfoTagItemViewProps extends SelectableRoundedTextButtonProps { }

const InfoTagItemView = (() => {

    const styles = StyleSheet.create({
        root: {
            marginBottom: infoTagViewSpacing,
            marginRight: infoTagViewSpacing,
        },
    });

    const InfoTagItemView = (props: InfoTagItemViewProps) => {
        return <View style={styles.root}>
            <SelectableRoundedTextButton {...props}/>
        </View>
    }
    return InfoTagItemView;
})();

