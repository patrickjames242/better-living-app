import React, { useMemo } from 'react';
import { useSelector } from '../../../../../redux/store';
import { useField } from '../../../../../helpers/formik';
import { ProductEditOrCreateValues } from './helpers';
import { caseInsensitiveStringSort } from '../../../../../helpers/general';
import OrderingSystemFormSelectableTagsChooserField from '../OrderingSystemFormSelectableTagsChooserField';

const ProductEditOrCreationInfoTagsSelector = (() => {
  function useSortedInfoTags() {
    const infoTagsReduxState = useSelector(
      state => state.orderingSystem.productInfoTags,
    );
    return useMemo(() => {
      return infoTagsReduxState
        .toSet()
        .sort(caseInsensitiveStringSort(x => x.title))
        .toArray();
    }, [infoTagsReduxState]);
  }

  const ProductEditOrCreationInfoTagsSelector = () => {
    const infoTags = useSortedInfoTags();

    const [, { value }, { setValue }] = useField<
      ProductEditOrCreateValues,
      'infoTagIds'
    >('infoTagIds');

    return (
      <OrderingSystemFormSelectableTagsChooserField
        containerTopTitleText="Info Tags"
        allSortedItems={infoTags}
        selectedItemIds={value}
        onSelectedItemsDidChange={setValue}
      />
    );
  };
  return ProductEditOrCreationInfoTagsSelector;
})();

export default ProductEditOrCreationInfoTagsSelector;
