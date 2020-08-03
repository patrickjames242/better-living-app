
import ProductInfoTag from "./ProductInfoTag";
import { getProductInfoTagFromJsonResponseObj_orNull } from "./helpers";
import store from "../../../redux/store";
import { updateAllProductInfoTagsAction, insertOrUpdateProductInfoTagAction, deleteProductInfoTagAction } from "../../../redux/orderingSystem/productInfoTags";
import { getOrderingSystemObjRealtimeUpdater } from "../helpers";


export const handleProductInfoTagsRealtimeUpdate = getOrderingSystemObjRealtimeUpdater<ProductInfoTag>({
    jsonObjConverter: getProductInfoTagFromJsonResponseObj_orNull,
    allObjectsStateUpdater: allInfoTags => store.dispatch(updateAllProductInfoTagsAction(allInfoTags)),
    insertOrUpdateStateUpdater: infoTag => store.dispatch(insertOrUpdateProductInfoTagAction(infoTag)),
    deleteStateUpdater: id => store.dispatch(deleteProductInfoTagAction(id)),
});


