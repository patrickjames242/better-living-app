
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextFieldViewContainer, TextFieldTextInput } from '../../../../../../helpers/Views/TextFieldView';
import SpacerView from '../../../../../../helpers/Spacers/SpacerView';
import BouncySquareIconButton from '../../../../../../helpers/Buttons/BouncySquareIconButton';
import AssetImages from '../../../../../../images/AssetImages';
import { useField } from '../../../../../../helpers/formik';
import { MenuEditOrCreationValues, MenuEditOrCreateProductCategory } from '../helpers';
import { Set } from 'immutable';
import { DefaultKeyboardConfigs } from '../../../../../../helpers/general';


const MenuEditOrCreationProductCategoriesCreateNewView = (() => {

    const styles = StyleSheet.create({
        contentContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        textFieldInput: {
            flex: 1,
        }
    });

    const MenuEditOrCreationProductCategoriesCreateNewView = () => {

        const [textFieldText, setTextFieldText] = useState('');

        const [, { value }, { setValue }] = useField<MenuEditOrCreationValues, 'productCategories'>('productCategories');

        return <TextFieldViewContainer topTitleText="Add New Category">
            <SpacerView style={styles.contentContainer} space={10}>
                <TextFieldTextInput
                    value={textFieldText}
                    onChangeText={setTextFieldText}
                    style={styles.textFieldInput}
                    placeholder="Type title here..."
                    {...DefaultKeyboardConfigs.title}
                />
                <BouncySquareIconButton
                    iconSources={{white: AssetImages.plusIcon.white}}
                    isEnabled={textFieldText.trim().length >= 1}
                    onPress={() => {
                        const newCategory: MenuEditOrCreateProductCategory = {
                            customId: value.size,
                            title: textFieldText,
                            productIds: Set(),
                        };
                        setValue(value.set(newCategory.customId, newCategory));
                        setTextFieldText('');
                    }}
                />
            </SpacerView>
        </TextFieldViewContainer>
    }
    return React.memo(MenuEditOrCreationProductCategoriesCreateNewView);
})();

export default MenuEditOrCreationProductCategoriesCreateNewView;
