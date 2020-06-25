
import { Optional } from "../../helpers/general";
import HealthTip from "./HealthTip";
import { List } from "immutable";
import store from "../../redux/store";
import { insertOrUpdateHealthTip, deleteHealthTip, updateAllHealthTips } from "../../redux/healthTips";


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
                const converted = getHealthTipFromObject(item);
                if (converted == null) { continue; }
                list.push(converted);
            }
        });
        store.dispatch(updateAllHealthTips(healthTips));
    }

    const changeType = getChangeTypeFromString(jsonData.change_type);
    const changedObject = jsonData.changed_object;

    if (typeof changedObject === 'object' && typeof changeType != null) {

        switch (changeType) {
            case ChangeType.insert:
            case ChangeType.update:{
                const healthTip = getHealthTipFromObject(changedObject);
                if (healthTip == null) {break;}
                store.dispatch(insertOrUpdateHealthTip(healthTip));
                break;
            }
            case ChangeType.delete:{
                const deletedHealthTipId = changedObject.id;
                if (typeof deletedHealthTipId !== "number"){break;}
                store.dispatch(deleteHealthTip(deletedHealthTipId));
                break;
            }   
        }

    }
}



/// remember that this throws if any of the values are not present or invalid
function getHealthTipFromObject(object: { [index: string]: any }) {
    try {
        const yt_ids = List<string>(object.yt_video_ids);
        const audio_urls = List<string>(object.audio_urls)
        return new HealthTip(object.id, object.title, new Date(object.date), yt_ids, audio_urls, object.article_text);
    } catch (error) {
        console.error("a health tip object could not be converted because of an error ->", error, object);
        return null;
    }
}







