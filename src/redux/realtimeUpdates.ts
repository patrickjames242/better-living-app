import { CustomReduxAction } from './helpers';
import ActionStrings from './actionStrings';

export enum RealtimeUpdatesConnectionState {
  noConnectionAttemptMade = 'noConnectionAttemptMade',
  connecting = 'connecting',
  connected = 'connected',
  disconnected = 'disconnected',
}

export type UpdateRealtimeUpdatesConnectionStateAction = CustomReduxAction<{
  newState: RealtimeUpdatesConnectionState;
}>;

export function updateRealtimeUpdatesConnectionStateAction(
  newState: RealtimeUpdatesConnectionState,
): UpdateRealtimeUpdatesConnectionStateAction {
  return {
    type: ActionStrings.realtimeUpdates.UPDATE_CONNECTION_STATE,
    newState,
  };
}

export type UpdateRealtimeUpdatesGotInitialUpdatesAction = CustomReduxAction<{
  gotInitialUpdates: boolean;
}>;

export function updateRealtimeUpdatesGotInitialUpdatesAction(
  gotInitialUpdates: boolean,
): UpdateRealtimeUpdatesGotInitialUpdatesAction {
  return {
    type: ActionStrings.realtimeUpdates.GOT_INITIAL_UPDATES,
    gotInitialUpdates,
  };
}

export type RealtimeUpdatesActions =
  | UpdateRealtimeUpdatesConnectionStateAction
  | UpdateRealtimeUpdatesGotInitialUpdatesAction;

interface RealtimeUpdatesState {
  connectionState: RealtimeUpdatesConnectionState;
  gotInitialUpdates: boolean;
}

export const defaultRealtimeUpdatesState: RealtimeUpdatesState = {
  connectionState: RealtimeUpdatesConnectionState.noConnectionAttemptMade,
  gotInitialUpdates: false,
};

export function realtimeUpdatesReducer(
  state: RealtimeUpdatesState = defaultRealtimeUpdatesState,
  action: RealtimeUpdatesActions,
): RealtimeUpdatesState {
  switch (action.type) {
    case ActionStrings.realtimeUpdates.UPDATE_CONNECTION_STATE: {
      const { newState } = action as UpdateRealtimeUpdatesConnectionStateAction;
      if (newState === state.connectionState) return state;
      else return { ...state, connectionState: newState };
    }
    case ActionStrings.realtimeUpdates.GOT_INITIAL_UPDATES: {
      const { gotInitialUpdates } =
        action as UpdateRealtimeUpdatesGotInitialUpdatesAction;
      if (state.gotInitialUpdates === gotInitialUpdates) return state;
      else return { ...state, gotInitialUpdates };
    }
    default:
      return state;
  }
}
