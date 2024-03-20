import getErrorObjFromApiObjValidateFunction from '../helpers';
import {
  GlobalSettingsResponseObj as GlobalSettingsJsonResponseObj,
  globalSettingsResponseObjValidator,
} from './validation';

export default class GlobalSettings {
  readonly isOrderingSystemEnabled: boolean;
  readonly vatPercentage: number;
  readonly deliveryFee: number;

  constructor(response: GlobalSettingsJsonResponseObj) {
    if (globalSettingsResponseObjValidator(response) === false) {
      throw getErrorObjFromApiObjValidateFunction(
        globalSettingsResponseObjValidator,
        'Global Settings',
      );
    }
    const json = response;

    this.isOrderingSystemEnabled = json.is_ordering_system_enabled;
    this.vatPercentage = json.vat_percentage;
    this.deliveryFee = json.delivery_fee;
  }
}
