import { Optional } from '../helpers/general';
import React from 'react';

export enum InitialAppScreenType {
  todaysMenu = 'todaysMenu',
  healthTips = 'healthTips',
}

export interface AppContextValue {
  initialAppScreen: Optional<
    | {
        type: InitialAppScreenType.todaysMenu;
      }
    | {
        type: InitialAppScreenType.healthTips;
        healthTipId?: number;
      }
  >;
}

export const AppContext = React.createContext<AppContextValue>({
  initialAppScreen: null,
});
