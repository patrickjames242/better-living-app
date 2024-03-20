import { Optional } from '../../../helpers/general';
import { Set } from 'immutable';
import {
  MealCategoryResponseObj,
  mealCategoryResponseObjValidator,
} from './validation';
import getErrorObjFromApiObjValidateFunction from '../../helpers';

export default class MealCategory {
  readonly id: number;
  readonly uniqueName: string;
  readonly displayName: Optional<string>;
  readonly productIds: Set<number>;

  constructor(mealCategoryResponseObj: MealCategoryResponseObj) {
    if (mealCategoryResponseObjValidator(mealCategoryResponseObj) === false) {
      throw getErrorObjFromApiObjValidateFunction(
        mealCategoryResponseObjValidator,
        'MealCategory',
      );
    }

    const json = mealCategoryResponseObj;

    this.id = json.id;
    this.uniqueName = json.unique_name;
    this.displayName = json.display_name;
    this.productIds = Set(json.product_ids);
  }
}
