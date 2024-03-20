import AsyncStorage from '@react-native-community/async-storage';
import GlobalSettings from '../api/globalSettings/GlobalSettings';
import { GlobalSettingsResponseObj } from '../api/globalSettings/validation';
import ActionStrings from './actionStrings';
import { CustomReduxAction } from './helpers';

export type UpdateGlobalSettingsAction = CustomReduxAction<{
  globalSettings: GlobalSettings;
}>;

export function updateGlobalSettingsAction(
  globalSettings: GlobalSettings,
): UpdateGlobalSettingsAction {
  return {
    type: ActionStrings.globalSettings.UPDATE_GLOBAL_SETTINGS,
    globalSettings,
  };
}

export type GlobalSettingsActions = UpdateGlobalSettingsAction;

export const defaultGlobalSettings = new GlobalSettings({
  is_ordering_system_enabled: true,
  vat_percentage: 0,
  delivery_fee: 0,
});

export function globalSettingsReducer(
  state = defaultGlobalSettings,
  action: GlobalSettingsActions,
): GlobalSettings {
  switch (action.type) {
    case ActionStrings.globalSettings.UPDATE_GLOBAL_SETTINGS: {
      const { globalSettings } = action as UpdateGlobalSettingsAction;
      return globalSettings;
    }
    default:
      return state;
  }
}

import('./store').then(module => {
  const globalSettingsKey = 'globalSettingsKey';

  AsyncStorage.getItem(globalSettingsKey).then(jsonString => {
    // wrapping in a try block just in case I change the properties in the future and GlobalSettings object cannot be instantiated
    try {
      jsonString != null &&
        module.default.getState().globalSettings == null &&
        module.default.dispatch(
          updateGlobalSettingsAction(
            new GlobalSettings(JSON.parse(jsonString)),
          ),
        );
    } catch (error) {
      console.log(error);
    }
  });

  module.addSelectedStateListener(
    state => state.globalSettings,
    globalSettings => {
      if (globalSettings === defaultGlobalSettings) return;
      const objToStore: GlobalSettingsResponseObj = {
        is_ordering_system_enabled: globalSettings.isOrderingSystemEnabled,
        vat_percentage: globalSettings.vatPercentage,
        delivery_fee: globalSettings.deliveryFee,
      };
      AsyncStorage.setItem(globalSettingsKey, JSON.stringify(objToStore));
    },
  );
});
