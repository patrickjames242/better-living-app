import { CustomReduxAction } from '../helpers';
import Product from '../../api/orderingSystem/products/Product';
import { List, Map } from 'immutable';
import ActionStrings from '../actionStrings';

export type UpdateAllProductsAction = CustomReduxAction<{
  allProducts: List<Product>;
}>;

export function updateAllProductsAction(
  allProducts: List<Product>,
): UpdateAllProductsAction {
  return {
    type: ActionStrings.orderingSystem.products.UPDATE_ALL_PRODUCTS,
    allProducts: allProducts,
  };
}

export type InsertOrUpdateProductAction = CustomReduxAction<{
  product: Product;
}>;

export function insertOrUpdateProductAction(
  product: Product,
): InsertOrUpdateProductAction {
  return {
    type: ActionStrings.orderingSystem.products.INSERT_OR_UPDATE_PRODUCT,
    product: product,
  };
}

export type DeleteProductAction = CustomReduxAction<{
  productId: number;
}>;

export function deleteProductAction(productId: number): DeleteProductAction {
  return {
    type: ActionStrings.orderingSystem.products.DELETE_PRODUCT,
    productId: productId,
  };
}

export type ProductsActions =
  | UpdateAllProductsAction
  | InsertOrUpdateProductAction
  | DeleteProductAction;

export function productsReducer(
  state = Map<number, Product>(),
  action: ProductsActions,
) {
  const strings = ActionStrings.orderingSystem.products;
  switch (action.type) {
    case strings.UPDATE_ALL_PRODUCTS: {
      const allProducts = (action as UpdateAllProductsAction).allProducts;
      return Map(allProducts.map(x => [x.id, x]));
    }
    case strings.INSERT_OR_UPDATE_PRODUCT: {
      const product = (action as InsertOrUpdateProductAction).product;
      return state.set(product.id, product);
    }
    case strings.DELETE_PRODUCT: {
      const id = (action as DeleteProductAction).productId;
      return state.remove(id);
    }
    default:
      return state;
  }
}
