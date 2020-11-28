import { Optional } from "../../helpers/general";
import { useSelector } from "../../redux/store";
import Order from "./Order";
import currency from 'currency.js';

export function useCalculatedPriceInfoForOrder(order: Order): {
    total: number,
    subtotal: number,
    vat: number,
    deliveryFee: Optional<number>,
    
}{

    const globalSettings = useSelector(state => state.globalSettings);

    const deliveryFee = (() => {
        if (order.userWantsOrderDelivered === false){return null;}
        return order.deliveryFeeCharged ?? globalSettings.deliveryFee;
    })();

    let subtotal: currency;
    let vat: currency;

    if (order.userPaidOnline){
        subtotal = currency(order.subtotalCharged ?? 0);
        vat = currency(order.vatCharged ?? 0);
    } else {
        subtotal = order.detailsJson.reduce<currency>((a1, a2) => {
            return a1.add(currency(a2.quantity).multiply((a2.entry_type === 'product' ? a2.product_price : a2.meal_price)));
        }, currency(0)).add(deliveryFee ?? 0);
        vat = currency(globalSettings.vatPercentage).multiply(subtotal);
    }

    return {
        subtotal: subtotal.toJSON(),
        vat: vat.toJSON(),
        total: subtotal.add(vat).add(deliveryFee ?? 0).toJSON(),
        deliveryFee,
    }
}