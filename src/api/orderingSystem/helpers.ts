import { Optional } from "../../helpers/general";
import { List } from "immutable";


export enum OrderingSystemChangeType{
    insert = 'insert',
    update = 'update',
    delete = 'delete',
}


export function getOrderingSystemObjRealtimeUpdater<ObjType>(props: {
    jsonObjConverter: (jsonObj: any) => Optional<ObjType>,
    allObjectsStateUpdater: (allObjects: List<ObjType>) => void,
    insertOrUpdateStateUpdater: (insertedOrUpdatedObject: ObjType) => void;
    deleteStateUpdater: (deletedObjId: number) => void;
}){
    return function(json: any){
    
        if (typeof json !== 'object'){return;}
        const all_objects = json.all_objects;

        if (all_objects instanceof Array){
            const allConvertedObjs = List<ObjType>().withMutations(list => {
                for (const obj of all_objects){
                    const converted = props.jsonObjConverter(obj);
                    converted == null || list.push(converted);
                }
            });
            props.allObjectsStateUpdater(allConvertedObjs);
        }

        const changed_objects = json.changed_objects;

        if (changed_objects instanceof Array){
            for (const changed_object_item of changed_objects){
                const changed_object = changed_object_item.changed_object;
                switch (changed_object_item.change_type){
                    case OrderingSystemChangeType.insert:
                    case OrderingSystemChangeType.update:{
                        const convertedObj = props.jsonObjConverter(changed_object);
                        convertedObj == null || props.insertOrUpdateStateUpdater(convertedObj);
                        break;
                    }
                    case OrderingSystemChangeType.delete: {
                        const objId = changed_object.id;
                        typeof objId === 'number' && props.deleteStateUpdater(objId);
                        break;
                    }
                }
            }
        }
    }
}

