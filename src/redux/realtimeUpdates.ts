import { CustomReduxAction } from "./helpers";
import ActionStrings from "./actionStrings";



export enum RealtimeUpdatesConnectionState{
    noConnectionAttemptMade = 'noConnectionAttemptMade',
    connecting = 'connecting',
    connected = 'connected',
    connectedAndGotInitialUpdates = 'connectedAndGotInitialUpdates',
    disconnected = 'disconnected',
}

export type UpdateRealtimeUpdatesConnectionStateAction = CustomReduxAction<{newState: RealtimeUpdatesConnectionState}>

export function updateRealtimeUpdatesConnectionStateAction(newState: RealtimeUpdatesConnectionState): UpdateRealtimeUpdatesConnectionStateAction{
    return {
        type: ActionStrings.realtimeUpdates.UPDATE_CONNECTION_STATE,
        newState,
    }
}

interface RealtimeUpdatesState{
    connectionState: RealtimeUpdatesConnectionState;
}

export const defaultRealtimeUpdatesState: RealtimeUpdatesState = {
    connectionState: RealtimeUpdatesConnectionState.noConnectionAttemptMade,
}

export function realtimeUpdatesReducer(
    state: RealtimeUpdatesState = defaultRealtimeUpdatesState, 
    action: UpdateRealtimeUpdatesConnectionStateAction,
): RealtimeUpdatesState{
    switch (action.type){
        case ActionStrings.realtimeUpdates.UPDATE_CONNECTION_STATE:{
            const newState = action.newState;
            return (state.connectionState === newState) ? state : { connectionState: newState };
        }
        default: return state;
    }
}

