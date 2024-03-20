import { getProductFromJsonResponseObj_orNull } from './helpers';
import store from '../../../redux/store';
import {
  updateAllProductsAction,
  insertOrUpdateProductAction,
  deleteProductAction,
} from '../../../redux/orderingSystem/products';
import { getOrderingSystemObjRealtimeUpdater } from '../helpers';
import Product from './Product';

export const handleProductsRealtimeUpdate =
  getOrderingSystemObjRealtimeUpdater<Product>({
    jsonObjConverter: getProductFromJsonResponseObj_orNull,
    allObjectsStateUpdater: allProducts =>
      store.dispatch(updateAllProductsAction(allProducts)),
    insertOrUpdateStateUpdater: product =>
      store.dispatch(insertOrUpdateProductAction(product)),
    deleteStateUpdater: id => store.dispatch(deleteProductAction(id)),
  });
