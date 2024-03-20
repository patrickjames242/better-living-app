import { Optional } from '../../helpers/general';
import { CartEntriesMapValue } from '../../redux/cart';
import { fetchFromAPI, HttpMethod } from '../api';
import { CartProductEntry } from '../cart/CartProductEntry';
import Order from './Order';
import { OrderJsonResponseObj } from './validation';
import { v4 as uuidv4 } from 'react-native-uuid';
import { getExpoNotificationDeviceTokenIfPossible } from '../authentication/authRequests';

const basePath = 'orders/';

export type OrderItemRequestObj =
  | {
      entry_type: 'product';
      product_id: number;
      quantity: number;
    }
  | {
      entry_type: 'meal';
      quantity: number;
      meal_id: number;
      choices: {
        chosen_product_id: number;
        meal_category_id: number;
      }[];
    };

const user_wants_order_delivered: 'user_wants_order_delivered' =
  'user_wants_order_delivered';
const user_paid_online: 'user_paid_online' = 'user_paid_online';

export type OrderRequestObj = {
  user_notes: Optional<string>;
  order_items: OrderItemRequestObj[];
} & (
  | ({
      [user_paid_online]: true;
      credit_card_number: string;
      card_expiration_date: string;
      card_cvv: string;
      card_first_name: string;
      card_last_name: string;
    } & (
      | { [user_wants_order_delivered]: false }
      | { [user_wants_order_delivered]: true; delivery_directions: string }
    ))
  | {
      [user_paid_online]: false;
      [user_wants_order_delivered]: false;
    }
);

export function getRequestOrderItemsFromCartEntries(
  cartEntries: CartEntriesMapValue[],
): OrderItemRequestObj[] {
  return cartEntries.map(x => {
    const quantity = (() => {
      if (x.pendingQuantityChangesInfo == null) {
        return x.entry.quantity;
      } else {
        return (
          x.pendingQuantityChangesInfo.originalQuantity +
          x.pendingQuantityChangesInfo.pendingChange
        );
      }
    })();

    if (x.entry instanceof CartProductEntry) {
      return {
        entry_type: 'product',
        product_id: x.entry.productId,
        quantity: quantity,
      };
    } else {
      return {
        entry_type: 'meal',
        quantity: quantity,
        meal_id: x.entry.mealId,
        choices: x.entry.choices.toArray().map(y => ({
          chosen_product_id: y.chosenProductId,
          meal_category_id: y.mealProductCategoryId,
        })),
      };
    }
  });
}

export const submitOrder = (() => {
  let _nextUnusedUuid = uuidv4();

  return async function (requestInfo: OrderRequestObj) {
    const deviceId = await getExpoNotificationDeviceTokenIfPossible();
    const result = await fetchFromAPI<OrderJsonResponseObj>({
      method: HttpMethod.post,
      path: basePath + 'submit-order/?emptyCartOnComplete=true',
      jsonBody: {
        user_provided_uuid: _nextUnusedUuid,
        current_notification_device_id_key: deviceId,
        ...requestInfo,
      },
    });
    _nextUnusedUuid = uuidv4();
    return new Order(result);
  };
})();

export function updateOrderIsCompleted(orderId: string, isCompleted: boolean) {
  return fetchFromAPI<OrderJsonResponseObj>({
    method: HttpMethod.put,
    path: basePath + orderId + '/',
    jsonBody: {
      is_completed: isCompleted,
    },
  }).then(orderResponse => {
    return new Order(orderResponse);
  });
}

export function checkOrderValidity(orderItems: OrderItemRequestObj[]) {
  return fetchFromAPI<null>({
    method: HttpMethod.put,
    path: basePath + 'check-order-validity/',
    jsonBody: {
      order_items: orderItems,
    },
  });
}

function getPaginationParams(maxAmount?: number, maxDate?: string) {
  return [
    ...(maxAmount == null ? [] : [`maxAmount=${maxAmount}`]),
    ...(maxDate == null ? [] : [`maxDate=${maxDate}`]),
  ].join('&');
}

export function getCurrentUserOrders(maxAmount?: number, maxDate?: string) {
  let url =
    basePath + `all-for-user/?` + getPaginationParams(maxAmount, maxDate);
  return fetchFromAPI<OrderJsonResponseObj[]>({
    method: HttpMethod.get,
    path: url,
  }).then(orderResponses => {
    return orderResponses.map(json => new Order(json));
  });
}

export function getAllOrders(maxAmount?: number, maxDate?: string) {
  let url = basePath + `all/?` + getPaginationParams(maxAmount, maxDate);
  return fetchFromAPI<OrderJsonResponseObj[]>({
    method: HttpMethod.get,
    path: url,
  }).then(orderResponses => {
    return orderResponses.map(json => new Order(json));
  });
}
