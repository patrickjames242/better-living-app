import { Optional } from '../../../helpers/general';
import ajv from 'ajv';

export const ProductFormDataKeys: {
  json: 'json';
  set_image: 'set_image';
} = {
  json: 'json',
  set_image: 'set_image',
};

export const ProductJsonKeys: {
  id: 'id';
  title: 'title';
  description: 'description';
  image_url: 'image_url';
  individual_price: 'individual_price';
  should_be_sold_individually: 'should_be_sold_individually';
  info_tag_ids: 'info_tag_ids';
} = {
  id: 'id',
  title: 'title',
  description: 'description',
  image_url: 'image_url',
  individual_price: 'individual_price',
  should_be_sold_individually: 'should_be_sold_individually',
  info_tag_ids: 'info_tag_ids',
};

export interface ProductJsonResponseObj {
  [ProductJsonKeys.id]: number;
  [ProductJsonKeys.title]: string;
  [ProductJsonKeys.description]: Optional<string>;
  [ProductJsonKeys.image_url]: Optional<string>;
  [ProductJsonKeys.individual_price]: Optional<number>;
  [ProductJsonKeys.should_be_sold_individually]: boolean;
  [ProductJsonKeys.info_tag_ids]: number[];
}

const ProductApiResponseSchema = {
  type: 'object',
  properties: {
    [ProductJsonKeys.id]: { type: 'number' },
    [ProductJsonKeys.title]: { type: 'string' },
    [ProductJsonKeys.description]: { type: ['string', 'null'] },
    [ProductJsonKeys.image_url]: { type: ['string', 'null'], format: 'uri' },
    [ProductJsonKeys.individual_price]: { type: ['number', 'null'] },
    [ProductJsonKeys.should_be_sold_individually]: { type: 'boolean' },
    [ProductJsonKeys.info_tag_ids]: {
      type: 'array',
      items: { type: 'number' },
    },
  },
  required: [
    ProductJsonKeys.id,
    ProductJsonKeys.title,
    ProductJsonKeys.description,
    ProductJsonKeys.image_url,
    ProductJsonKeys.individual_price,
    ProductJsonKeys.should_be_sold_individually,
    ProductJsonKeys.info_tag_ids,
  ],
};

export const productResponseObjValidator = new ajv({ allErrors: true }).compile(
  ProductApiResponseSchema,
);
