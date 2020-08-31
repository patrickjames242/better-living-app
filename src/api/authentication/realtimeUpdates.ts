import store from "../../redux/store";
import { updateUserObjectAction, logOutAction } from "../../redux/authentication";
import { User } from "./User";


export function handleUserAuthRealtimeUpdate(json: any){
    if (typeof json !== 'object'){return;}
    const user_object = json.user_object;

    if (json.change_type === 'delete'){
        store.dispatch(logOutAction())
    } else if (typeof user_object === 'object'){
        store.dispatch(updateUserObjectAction(new User(user_object)));
    }
}

