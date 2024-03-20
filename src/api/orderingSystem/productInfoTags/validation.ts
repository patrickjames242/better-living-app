import ajv from 'ajv';

export const ProductInfoTagJsonKeys: {
  id: 'id';
  title: 'title';
} = {
  id: 'id',
  title: 'title',
};

export interface ProductInfoTagJsonResponseObj {
  [ProductInfoTagJsonKeys.id]: number;
  [ProductInfoTagJsonKeys.title]: string;
}

const ProductInfoTagApiResponseSchema = {
  type: 'object',
  properties: {
    [ProductInfoTagJsonKeys.id]: { type: 'number' },
    [ProductInfoTagJsonKeys.title]: { type: 'string' },
  },
  required: [ProductInfoTagJsonKeys.id, ProductInfoTagJsonKeys.title],
};

export const productInfoTagResponseObjValidator = new ajv({
  allErrors: true,
}).compile(ProductInfoTagApiResponseSchema);
