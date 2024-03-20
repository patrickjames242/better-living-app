import { Optional } from '../../helpers/general';
import HealthTip from './HealthTip';
import { getHealthTipFromObject_orNull } from './helpers';
import Notification from '../../helpers/Notification';

export enum HealthTipChangeType {
  update = 'update',
  insert = 'insert',
  delete = 'delete',
}

export type HealthTipUpdatesNotificationInfo =
  | {
      changeType: HealthTipChangeType.insert | HealthTipChangeType.update;
      changedObject: HealthTip;
    }
  | {
      changeType: HealthTipChangeType.delete;
      deletedObjectId: number;
    };

export const healthTipsUpdatesNotification =
  Notification<HealthTipUpdatesNotificationInfo>();

function getChangeTypeFromString(
  string: string,
): Optional<HealthTipChangeType> {
  switch (string) {
    case 'update':
      return HealthTipChangeType.update;
    case 'insert':
      return HealthTipChangeType.insert;
    case 'delete':
      return HealthTipChangeType.delete;
    default:
      return null;
  }
}

export function handleHealthTipsRealtimeUpdate(jsonData: any) {
  if (typeof jsonData !== 'object' || jsonData == null) {
    return;
  }

  const changeType = getChangeTypeFromString(jsonData.change_type);
  const changedObject = jsonData.changed_object;

  if (typeof changedObject === 'object' && typeof changeType != null) {
    switch (changeType) {
      case HealthTipChangeType.insert:
      case HealthTipChangeType.update: {
        const healthTip = getHealthTipFromObject_orNull(changedObject);
        if (healthTip == null) {
          break;
        }
        healthTipsUpdatesNotification.post({
          changeType: changeType,
          changedObject: healthTip,
        });
        break;
      }
      case HealthTipChangeType.delete: {
        const deletedHealthTipId = changedObject.id;
        if (typeof deletedHealthTipId !== 'number') {
          break;
        }
        healthTipsUpdatesNotification.post({
          changeType: changeType,
          deletedObjectId: deletedHealthTipId,
        });
        break;
      }
    }
  }
}
