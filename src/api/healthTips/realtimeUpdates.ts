
import { Optional } from "../../helpers/general";
import HealthTip from "./HealthTip";
import { List } from "immutable";
import store from "../../redux/store";
import { insertOrUpdateHealthTipAction, deleteHealthTipAction, updateAllHealthTipsAction } from "../../redux/healthTips";
import { getHealthTipFromObject_orNull } from "./helpers";


enum ChangeType {
    update,
    insert,
    delete,
}

function getChangeTypeFromString(string: string): Optional<ChangeType> {
    switch (string) {
        case 'update': return ChangeType.update;
        case 'insert': return ChangeType.insert;
        case 'delete': return ChangeType.delete;
        default: return null;
    }
}

export function handleHealthTipsRealtimeUpdate(jsonData: any) {
    if (typeof jsonData !== 'object') { return; }

    const allObjects = jsonData.all_objects;

    if (allObjects instanceof Array) {
        let healthTips = List<HealthTip>().withMutations(list => {
            for (const item of allObjects) {
                const converted = getHealthTipFromObject_orNull(item);
                if (converted == null) { continue; }
                list.push(converted);
            }
        });
        store.dispatch(updateAllHealthTipsAction(healthTips));
    }

    const changeType = getChangeTypeFromString(jsonData.change_type);
    const changedObject = jsonData.changed_object;

    if (typeof changedObject === 'object' && typeof changeType != null) {

        switch (changeType) {
            case ChangeType.insert:
            case ChangeType.update:{
                const healthTip = getHealthTipFromObject_orNull(changedObject);
                if (healthTip == null) {break;}
                store.dispatch(insertOrUpdateHealthTipAction(healthTip));
                break;
            }
            case ChangeType.delete:{
                const deletedHealthTipId = changedObject.id;
                if (typeof deletedHealthTipId !== "number"){break;}
                store.dispatch(deleteHealthTipAction(deletedHealthTipId));
                break;
            }   
        }

    }
}











