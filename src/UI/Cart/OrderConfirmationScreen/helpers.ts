import { Optional } from "../../../helpers/general";

export interface OrderConfirmationScreenValues {
    pickUpOrDelivery: Optional<PickUpOrDelivery>;
    howToPay: Optional<HowToPay>;
    deliveryDirections: string;
}

export enum PickUpOrDelivery {
    pickUp = 'pickUp',
    delivery = 'delivery'
}

export enum HowToPay {
    inPerson = 'inPerson',
    online = 'online'
}