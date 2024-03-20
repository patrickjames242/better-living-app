import { Optional } from '../../../helpers/general';
import ajv from 'ajv';

export const MealCategoryJsonKeys: {
  id: 'id';
  unique_name: 'unique_name';
  display_name: 'display_name';
  product_ids: 'product_ids';
} = {
  id: 'id',
  unique_name: 'unique_name',
  display_name: 'display_name',
  product_ids: 'product_ids',
};

export interface MealCategoryResponseObj {
  [MealCategoryJsonKeys.id]: number;
  [MealCategoryJsonKeys.unique_name]: string;
  [MealCategoryJsonKeys.display_name]: Optional<string>;
  [MealCategoryJsonKeys.product_ids]: number[];
}

const MealCategoryApiResponseSchema = {
  type: 'object',
  properties: {
    [MealCategoryJsonKeys.id]: { type: 'number' },
    [MealCategoryJsonKeys.unique_name]: { type: 'string' },
    [MealCategoryJsonKeys.display_name]: { type: ['string', 'null'] },
    [MealCategoryJsonKeys.product_ids]: {
      type: 'array',
      items: { type: 'number' },
    },
  },
  additionalProperties: false,
  required: [
    MealCategoryJsonKeys.id,
    MealCategoryJsonKeys.unique_name,
    MealCategoryJsonKeys.display_name,
    MealCategoryJsonKeys.product_ids,
  ],
};

export const mealCategoryResponseObjValidator = new ajv({
  allErrors: true,
}).compile(MealCategoryApiResponseSchema);
