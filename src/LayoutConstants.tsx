
import { getShadowStyle } from "./helpers/general";
import { CustomFont } from "./helpers/fonts/fonts";
import { CustomColors } from "./helpers/colors";

const LayoutConstants = {

    pageSideInsets: 20,
    productImageHeightPercentageOfWidth: 0.55,

    navBar: {
        cornerRadius: 25,
        shadowConfig: getShadowStyle(8),
    },

    sideMenuBar: {
        minWidthToShowSideBar: 600,
        padding: 30,
        barItem: {
            imageSize: 30,
            padding: 15,
        },
        get totalWidth() {
            return (this.padding * 2) +
                (this.barItem.padding * 2) +
                this.barItem.imageSize;
        },
    },

    floatingCellStyles: {
        padding: 15,
        borderRadius: 15,
        backgroundColor: 'white',
        shadowConfig: {
            ...getShadowStyle(15)
        },
        sectionSpacing: 30,
        sectionHeaderTextStyles: {
            fontSize: 20,
            fontFamily: CustomFont.bold,
            color: CustomColors.offBlackTitle.stringValue,
        },
        sectionHeaderBottomSpacing: 20,
        maxWidth: 700,
    },

};

export default LayoutConstants;


