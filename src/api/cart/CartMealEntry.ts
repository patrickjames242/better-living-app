import { List } from 'immutable';
import moment from 'moment-timezone';
import { assertValidObjFromApi } from '../helpers';
import {
  CartMealEntryJsonResponseObj,
  cartMealEntryResponseObjValidator,
} from './validation';

interface CartMealEntryChoice {
  mealProductCategoryId: number;
  chosenProductId: number;
}

export class CartMealEntry {
  // to force users to create an instance of this class in order to use this type
  private readonly dummyVariable = '';

  readonly id: string;
  readonly dateCreated: moment.Moment;
  readonly quantity: number;
  readonly mealId: number;
  readonly choices: List<CartMealEntryChoice>;

  static parse(apiResponseObj: CartMealEntryJsonResponseObj) {
    assertValidObjFromApi(
      cartMealEntryResponseObjValidator,
      'CartMealEntry',
      apiResponseObj,
    );
    const json = apiResponseObj;

    return new CartMealEntry(
      json.id,
      moment(apiResponseObj.date_created),
      json.quantity,
      json.meal_id,
      List(
        json.choices.map(x => ({
          mealProductCategoryId: x.meal_product_category_id,
          chosenProductId: x.chosen_product_id,
        })),
      ),
    );
  }

  constructor(
    id: string,
    dateCreated: moment.Moment,
    quantity: number,
    mealId: number,
    choices: List<CartMealEntryChoice>,
  ) {
    this.id = id;
    this.dateCreated = dateCreated;
    this.quantity = quantity;
    this.mealId = mealId;
    this.choices = choices;
  }
}
