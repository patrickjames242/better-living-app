import { getShadowStyle } from "./helpers/general";

const LayoutConstants = {

    pageSideInsets: 20,
    productImageHeightPercentageOfWidth: 0.55,

    navBar: {
        cornerRadius: 25,
        shadowConfig: getShadowStyle(8),
    },

    sideMenuBar: {
        minWidthToShowSideBar: 800,
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

};

export default LayoutConstants;