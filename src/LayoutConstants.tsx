
const LayoutConstants = {

    menuPage: {
        topAndBottomBarCornerRadius: 25,
        topAndBottomBarShadowConfig: {
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 5,
        },
        pageSideInsets: 20,
    },

    sideMenuBar: {
        minWidthToShowSideBar: 800,
        padding: 30,
        barItem: {
            imageSize: 30,
            padding: 15,
        },
        get totalWidth(){
            return (this.padding * 2) + 
            (this.barItem.padding * 2) + 
            this.barItem.imageSize;
        },
    },

};

export default LayoutConstants;