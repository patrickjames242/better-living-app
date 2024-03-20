import { CustomReduxAction } from '../helpers';
import { List, Map } from 'immutable';
import ProductInfoTag from '../../api/orderingSystem/productInfoTags/ProductInfoTag';
import ActionStrings from '../actionStrings';

export type UpdateAllProductInfoTagsAction = CustomReduxAction<{
  allProductInfoTags: List<ProductInfoTag>;
}>;

export function updateAllProductInfoTagsAction(
  allProductInfoTags: List<ProductInfoTag>,
): UpdateAllProductInfoTagsAction {
  return {
    type: ActionStrings.orderingSystem.productInfoTags.UPDATE_ALL_INFO_TAGS,
    allProductInfoTags,
  };
}

export type InsertOrUpdateProductInfoTagAction = CustomReduxAction<{
  productInfoTag: ProductInfoTag;
}>;

export function insertOrUpdateProductInfoTagAction(
  productInfoTag: ProductInfoTag,
): InsertOrUpdateProductInfoTagAction {
  return {
    type: ActionStrings.orderingSystem.productInfoTags
      .INSERT_OR_UPDATE_INFO_TAGS,
    productInfoTag,
  };
}

export type DeleteProductInfoTagAction = CustomReduxAction<{
  productInfoTagId: number;
}>;

export function deleteProductInfoTagAction(
  productInfoTagId: number,
): DeleteProductInfoTagAction {
  return {
    type: ActionStrings.orderingSystem.productInfoTags.DELETE_INFO_TAG,
    productInfoTagId,
  };
}

export type ProductInfoTagsActions =
  | UpdateAllProductInfoTagsAction
  | InsertOrUpdateProductInfoTagAction
  | DeleteProductInfoTagAction;

export function productInfoTagsReducer(
  state = Map<number, ProductInfoTag>(),
  action: ProductInfoTagsActions,
) {
  const strings = ActionStrings.orderingSystem.productInfoTags;
  switch (action.type) {
    case strings.UPDATE_ALL_INFO_TAGS: {
      const allInfoTags = (action as UpdateAllProductInfoTagsAction)
        .allProductInfoTags;
      return Map(allInfoTags.map(x => [x.id, x]));
    }
    case strings.INSERT_OR_UPDATE_INFO_TAGS: {
      const productInfoTag = (action as InsertOrUpdateProductInfoTagAction)
        .productInfoTag;
      return state.set(productInfoTag.id, productInfoTag);
    }
    case strings.DELETE_INFO_TAG: {
      const id = (action as DeleteProductInfoTagAction).productInfoTagId;
      return state.remove(id);
    }
    default:
      return state;
  }
}
