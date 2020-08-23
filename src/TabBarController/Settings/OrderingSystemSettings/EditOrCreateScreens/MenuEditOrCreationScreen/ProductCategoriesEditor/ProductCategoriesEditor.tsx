
import React, { useMemo } from 'react';
import { TextFieldViewContainer } from '../../../../../../helpers/Views/TextFieldView';
import LayoutConstants from '../../../../../../LayoutConstants';
import Spacer from '../../../../../../helpers/Spacers/Spacer';
import { useField } from '../../../../../../helpers/formik';
import { MenuEditOrCreationValues, MenuEditOrCreateProductCategory, menuEditOrCreateProductCategorySchema } from '../helpers';
import MenuEditOrCreationProductCategoryItemView from './ProductCategoryItemView';
import { Map, List } from 'immutable';
import SpacerView from '../../../../../../helpers/Spacers/SpacerView';
import { GenericEditingFormScreenConstants } from '../../../../../../helpers/Views/GenericEditingFormScreen';
import MenuEditOrCreationProductCategoriesCreateNewView from './ProductCategoriesCreateNewView';


const MenuEditOrCreationProductCategoriesEditor = () => {

    const [, { value }, { setValue }] = useField<MenuEditOrCreationValues, 'productCategories'>('productCategories');

    const categoriesArray = useMemo(() => {
        return value.toSet().sortBy(x => x.customId).toArray();
    }, [value]);

    const errorMessageMap = useMemo(() => {

        const titleMap = Map<string, List<MenuEditOrCreateProductCategory>>()
            .withMutations(set => {
                value.forEach(value => {
                    set.set(value.title, (set.get(value.title) ?? List()).push(value));
                });
            });

        const mapToReturn = Map<number, string>().withMutations(map => {
            value.map(x => {

                const validation: true | string = (() => {
                    try {
                        menuEditOrCreateProductCategorySchema.validateSync(x)
                        return true;
                    } catch (error) {
                        return error.message as string;
                    }
                })();

                if (typeof validation === 'string') {
                    map.set(x.customId, validation);
                } else if ((titleMap.get(x.title)?.size ?? 0) > 1) {
                    map.set(x.customId, 'Duplicate titles for product categories are not allowed.');
                }
            });
        });

        return mapToReturn;
    }, [value]);

    return <SpacerView space={GenericEditingFormScreenConstants.childrenSpacing}>
        {categoriesArray.length >= 1 && <TextFieldViewContainer topTitleText="Product Categories">
            <Spacer
                space={LayoutConstants.floatingCellStyles.padding}
                // eslint-disable-next-line react/no-children-prop
                children={categoriesArray.map(oldCategory => {
                    return <MenuEditOrCreationProductCategoryItemView
                        key={oldCategory.customId}
                        category={oldCategory}
                        onCategoryChanged={newCategory => {
                            setValue(value.set(newCategory.customId, newCategory));
                        }}
                        onCategoryDeleted={uuid => setValue(value.remove(uuid))}
                        errorMessage={errorMessageMap.get(oldCategory.customId) ?? null}
                    />;
                })}
            />
        </TextFieldViewContainer>}
        <MenuEditOrCreationProductCategoriesCreateNewView />
    </SpacerView>
}

export default MenuEditOrCreationProductCategoriesEditor;

