

export enum TabBarSelection {
    menu,
    cart,
    tips,
    contactRequests,
    settings
}

export const tabBarItemsData: {
    url: any,
    selection: TabBarSelection,
}[] = [
    {
        selection: TabBarSelection.menu,
        url: require('./icons/food.png'),
    },
    {
        selection: TabBarSelection.cart,
        url: require('./icons/shopping-cart.png'),
    },
    {
        selection: TabBarSelection.tips,
        url: require('./icons/tips.png'),
    },
    {
        selection: TabBarSelection.contactRequests,
        url: require('./icons/contact-requests.png'),
    },
    {
        selection: TabBarSelection.settings,
        url: require('./icons/settings.png'),
    }
]