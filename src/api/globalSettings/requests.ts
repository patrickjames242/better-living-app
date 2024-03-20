import { updateGlobalSettingsAction } from '../../redux/globalSettings';
import store from '../../redux/store';
import { fetchFromAPI, HttpMethod } from '../api';
import GlobalSettings from './GlobalSettings';
import { GlobalSettingsResponseObj } from './validation';

export type GlobalSettingsRequestObj = Partial<GlobalSettingsResponseObj>;

export function updateGlobalSettings(info: GlobalSettingsRequestObj) {
  return fetchFromAPI<GlobalSettingsResponseObj>({
    path: 'global-settings/update/',
    method: HttpMethod.put,
    jsonBody: info,
  }).then(responseObj => {
    const globalSettings = new GlobalSettings(responseObj);
    store.dispatch(updateGlobalSettingsAction(globalSettings));
    return globalSettings;
  });
}
