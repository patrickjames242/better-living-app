import ajv from 'ajv';

const UserJsonKeys: {
  id: 'id';
  first_name: 'first_name';
  last_name: 'last_name';
  user_type: 'user_type';
  email: 'email';
  phone_number: 'phone_number';
} = {
  id: 'id',
  first_name: 'first_name',
  last_name: 'last_name',
  user_type: 'user_type',
  email: 'email',
  phone_number: 'phone_number',
};

export interface UserJsonResponseObj {
  [UserJsonKeys.id]: number;
  [UserJsonKeys.first_name]: string;
  [UserJsonKeys.last_name]: string;
  [UserJsonKeys.user_type]: string;
  [UserJsonKeys.email]: string;
  [UserJsonKeys.phone_number]: string;
}

export enum UserType {
  manager = 'manager',
  employee = 'employee',
  customer = 'customer',
}

export const UserAPIResponseSchema = {
  type: 'object',
  properties: {
    [UserJsonKeys.id]: { type: 'number' },
    [UserJsonKeys.first_name]: { type: 'string' },
    [UserJsonKeys.last_name]: { type: 'string' },
    [UserJsonKeys.user_type]: {
      enum: [UserType.manager, UserType.employee, UserType.customer],
    },
    [UserJsonKeys.email]: {
      type: 'string',
      format: 'email',
    },
    [UserJsonKeys.phone_number]: { type: 'string' },
  },
  required: [
    UserJsonKeys.id,
    UserJsonKeys.first_name,
    UserJsonKeys.last_name,
    UserJsonKeys.user_type,
    UserJsonKeys.email,
    UserJsonKeys.phone_number,
  ],
};

const LogInSignUpJsonKeys: {
  user_object: 'user_object';
  access_token: 'access_token';
} = {
  user_object: 'user_object',
  access_token: 'access_token',
};

export interface LogInSignUpJsonResponseObj {
  [LogInSignUpJsonKeys.user_object]: UserJsonResponseObj;
  [LogInSignUpJsonKeys.access_token]: string;
}

export const LogInSignUpResponseSchema = {
  type: 'object',
  properties: {
    [LogInSignUpJsonKeys.user_object]: UserAPIResponseSchema,
    [LogInSignUpJsonKeys.access_token]: { type: 'string' },
  },
  required: [LogInSignUpJsonKeys.user_object, LogInSignUpJsonKeys.access_token],
};

export const userResponseObjValidator = new ajv({ allErrors: true }).compile(
  UserAPIResponseSchema,
);

export const logInSignUpResponseObjValidator = new ajv({
  allErrors: true,
}).compile(LogInSignUpResponseSchema);
