import { ProductJsonResponseObj } from './validation';
import Product from './Product';

export function getProductFromJsonResponseObj_orNull(
  apiResponseObj: ProductJsonResponseObj,
) {
  try {
    return new Product(apiResponseObj);
  } catch (error) {
    console.error(
      'A product obj could not be converted from json because of the following error ->',
      error,
      apiResponseObj,
    );
    return null;
  }
}
