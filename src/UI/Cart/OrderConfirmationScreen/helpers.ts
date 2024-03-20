import React from 'react';
import { Optional } from '../../../helpers/general';

export interface OrderConfirmationScreenValues {
  pickUpOrDelivery: Optional<PickUpOrDelivery>;
  howToPay: Optional<HowToPay>;
  deliveryDirections: string;
  creditCardNumber: string;
  cardExpirationDate: string;
  cardCVV: string;
  cardFirstName: string;
  cardLastName: string;
}

export enum PickUpOrDelivery {
  pickUp = 'pickUp',
  delivery = 'delivery',
}

export enum HowToPay {
  inPerson = 'inPerson',
  online = 'online',
}

export interface OrderConfirmationScreenContextValue {
  isOnlinePaymentAllowed: boolean;
}

export const OrderConfirmationScreenContext =
  React.createContext<OrderConfirmationScreenContextValue>({
    isOnlinePaymentAllowed: false,
  });
