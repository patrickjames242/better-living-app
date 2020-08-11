
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import GenericEditingFormScreen from '../../../../helpers/Views/GenericEditingFormScreen';
import { TextFieldView, MultilineTextFieldView } from '../../../../helpers/Views/TextFieldView';
import { SettingsNavStackParams } from '../../navigationHelpers';
import { StackScreenProps } from '@react-navigation/stack';
import ProductEditOrCreationInfoTagsSelector from './ProductEditOrCreationInfoTagsSelector';
import { Set } from 'immutable';
import { useSelector } from '../../../../redux/store';
import { mapOptional } from '../../../../helpers/general';



const ProductEditOrCreationScreen = (() => {
    
    const styles = StyleSheet.create({
        root: {
            
        },
    });
    
    const ProductEditOrCreationScreen = (props: StackScreenProps<SettingsNavStackParams, 'ProductEditOrCreate'>) => {

        const product = useSelector(state => { 
            return mapOptional(props.route.params.productId, id => {
                return state.orderingSystem.products.get(id);
            });
        });

        const [infoTagIds, setInfoTagIds] = useState(product?.infoTagIds ?? Set<number>());

        const navBarTitle = (() => {
            if (props.route.params.productId == null){
                return "Create Product";
            } else {
                return "Edit Product";
            }
        })();

        return <GenericEditingFormScreen 
            navBarTitle={navBarTitle}
            saveChangesButtonProps={{
                onPress: () => {},
            }}
        >
            <TextFieldView topTitleText="Title"/>
            <ProductEditOrCreationInfoTagsSelector 
                selectedInfoTagIds={infoTagIds}
                onSelectedIdsChanged={setInfoTagIds}
            />
            <MultilineTextFieldView topTitleText="Description"/>
        </GenericEditingFormScreen>
    }
    return ProductEditOrCreationScreen;
})();

export default ProductEditOrCreationScreen;

