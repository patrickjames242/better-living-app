
import React, { useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import AssetImages from '../../images/AssetImages';
import { RealtimeUpdatesConnectionState } from '../../redux/realtimeUpdates';
import { useSelector } from '../../redux/store';
import { Color } from '../colors';
import CustomActivityIndicator from './ActivityIndicator';
import NoItemsToShowView from './NoItemsToShowView';

export interface ListLoadingHolderViewProps {

}

const ListLoadingHolderView = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
    });

    const ListLoadingHolderView = (props: React.PropsWithChildren<ListLoadingHolderViewProps>) => {
        
        const hasAlreadyConnectedOnce = useRef(false);
        const hasFailedOnce = useRef(false);

        const realtimeUpdatesState = useSelector(state => state.realtimeUpdates);
        if (realtimeUpdatesState.gotInitialUpdates) {
            hasAlreadyConnectedOnce.current = true;
        }
        if (realtimeUpdatesState.connectionState === RealtimeUpdatesConnectionState.disconnected){
            hasFailedOnce.current = true;
        }

        return <>
            {(() => {
                if (hasAlreadyConnectedOnce.current) {
                    return props.children;
                } else {
                    return <View style={styles.root}>
                        {(() => {
                            if (hasFailedOnce.current === true) {
                                return <NoItemsToShowView imageSource={AssetImages.warningIconColored} imageStyle={{ height: 110, width: 110 }} title="Connection Issues 🙄" subtitle="Could not connect to the server. We'll keep trying in the background!" />    
                            } else {
                                return <CustomActivityIndicator size="large"/>
                            }
                        })()}
                    </View>
                }
            })()}
        </>;
        
    }
    return ListLoadingHolderView;
})();

export default ListLoadingHolderView;



