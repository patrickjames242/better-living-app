
import { LayoutRectangle } from "react-native";
import { computeNumberOfListColumns } from "../../../helpers/general";
import LayoutConstants from "../../../LayoutConstants";


export const OrdersUIConstants = {

    itemSpacing: 15,
    sideInsets: LayoutConstants.pageSideInsets,

    calculateNumberOfColumns: (layout: LayoutRectangle): number => {
        return computeNumberOfListColumns({ listWidth: layout.width, maxItemWidth: 350, sideInsets: OrdersUIConstants.sideInsets, horizontalItemSpacing: OrdersUIConstants.itemSpacing });
    },
};

