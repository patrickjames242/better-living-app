
import { Color, CustomColors } from "../../../helpers/colors";


const OrderConfirmationLayoutConstants = {
    selectableOptionViewSpacing: 10,

    selectionOutline:{
        color: {
            unselected: Color.gray(0.94).stringValue,
            selected: CustomColors.themeGreen.withAdjustedOpacity(0.8).stringValue,
        },
        width: 2.5,
        
    }
};

export default OrderConfirmationLayoutConstants;