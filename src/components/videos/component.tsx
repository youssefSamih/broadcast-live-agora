import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';

type Props = {
  channelName: string;
  isHost?: boolean;
  peerIds: number[];
};

export const Videos: React.FC<Props> = ({ channelName, isHost, peerIds }) => {
  return (
    <SafeAreaView style={styles.MainView}>
      {isHost ? (
        <RtcLocalView.SurfaceView
          style={styles.HostVideoView}
          channelId={channelName}
          renderMode={VideoRenderMode.Hidden}
        />
      ) : undefined}

      <ScrollView
        style={styles.RemoteContainer}
        contentContainerStyle={styles.RemoteContainerContent}
        horizontal={true}>
        {peerIds.map(value => {
          return (
            <RtcRemoteView.SurfaceView
              key={value}
              style={styles.Remote}
              uid={value}
              channelId={channelName}
              renderMode={VideoRenderMode.Hidden}
            />
          );
        })}

        {peerIds.length === 0 ? (
          <View style={styles.WaitingView}>
            <Text style={styles.WaitingTest}>Wait for other member</Text>
          </View>
        ) : undefined}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  WaitingView: {
    justifyContent: 'center',
    flex: 1,
  },
  WaitingTest: {
    color: 'white',
    marginHorizontal: Dimensions.get('screen').width / 3,
  },
  MainView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 100,
  },
  HostVideoView: {
    flex: 1,
  },
  RemoteContainer: {
    width: '100%',
    flex: 2,
    top: 5,
  },
  RemoteContainerContent: {
    paddingHorizontal: 2.5,
  },
  Remote: {
    width: 150,
    height: 150,
    marginHorizontal: 2.5,
  },
});
