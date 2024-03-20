import { useMemo } from 'react';
import { User } from '../../api/authentication/User';
import { UserType } from '../../api/authentication/validation';
import { Color } from '../../helpers/colors';
import { Optional } from '../../helpers/general';
import { useSelector } from '../../redux/store';
import BellIconSVG from './icons/hotel_svg';
import ContactRequestsIconSVG from './icons/contact-requests_svg';
import FoodIconSVG from './icons/food_svg';
import SettingsIconSVG from './icons/settings_svg';
import ShoppingCartIconSVG from './icons/shopping-cart_svg';
import TipsIconSVG from './icons/tips_svg';

export enum TabBarSelection {
  todaysOrders = 'TodaysOrders',
  menu = 'Menu',
  cart = 'Cart',
  tips = 'Tips',
  inquiries = 'Inquiries',
  settings = 'Settings',
}

const allTabBarItemsData: {
  [index: string]: {
    requiresAuthentication: boolean;
    icons: {
      png: any;
      svg: (props: {
        color: Color;
        style?: React.CSSProperties;
      }) => JSX.Element;
    };
  };
} = {
  [TabBarSelection.todaysOrders]: {
    icons: {
      png: require('./icons/hotel.png'),
      svg: BellIconSVG,
    },
    requiresAuthentication: true,
  },
  [TabBarSelection.menu]: {
    icons: {
      png: require('./icons/food.png'),
      svg: FoodIconSVG,
    },
    requiresAuthentication: false,
  },
  [TabBarSelection.cart]: {
    icons: {
      png: require('./icons/shopping-cart.png'),
      svg: ShoppingCartIconSVG,
    },
    requiresAuthentication: true,
  },
  [TabBarSelection.tips]: {
    icons: {
      png: require('./icons/tips.png'),
      svg: TipsIconSVG,
    },
    requiresAuthentication: false,
  },
  [TabBarSelection.inquiries]: {
    icons: {
      png: require('./icons/contact-requests.png'),
      svg: ContactRequestsIconSVG,
    },
    requiresAuthentication: false,
  },
  [TabBarSelection.settings]: {
    icons: {
      png: require('./icons/settings.png'),
      svg: SettingsIconSVG,
    },
    requiresAuthentication: true,
  },
};

export function getInfoForTabBarSelection(selection: TabBarSelection) {
  return allTabBarItemsData[selection];
}

export const customerSelections = [
  TabBarSelection.menu,
  TabBarSelection.cart,
  TabBarSelection.tips,
  TabBarSelection.inquiries,
  TabBarSelection.settings,
];

export const employeeAndManagerSelections = [
  TabBarSelection.todaysOrders,
  TabBarSelection.menu,
  TabBarSelection.cart,
  TabBarSelection.tips,
  TabBarSelection.settings,
];

export function getDefaultTabBarSelectionForUserObject(
  userObj: Optional<User>,
) {
  switch (userObj?.userType) {
    case UserType.employee:
    case UserType.manager:
      return TabBarSelection.todaysOrders;
    default:
      return TabBarSelection.menu;
  }
}

// export function useDefaultTabBarSelectionForCurrentUser(){
//     const userObject = useSelector(state => state.authentication?.userObject ?? null);
//     return getDefaultTabBarSelectionForUserObject(userObject);
// }

export function useTabBarSelectionsForCurrentUser() {
  const userType = useSelector(
    state => state.authentication?.userObject.userType ?? UserType.customer,
  );
  const selections = useMemo(() => {
    switch (userType) {
      case UserType.customer:
        return [...customerSelections];
      case UserType.employee:
      case UserType.manager:
        return [...employeeAndManagerSelections];
    }
  }, [userType]);
  return selections;
}
