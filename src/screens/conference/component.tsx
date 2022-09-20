import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RtcEngine, { ChannelProfile, ClientRole } from 'react-native-agora';
import { useNavigation } from '@react-navigation/native';
import { REACT_APP_APP_ID } from '@env';

import { RootStackParamList } from '../../../App';
import { Videos } from '../../components/videos/component';

type ScreenNavigationProp<T extends keyof RootStackParamList> =
  StackNavigationProp<RootStackParamList, T>;

type Props<T extends keyof RootStackParamList> = {
  navigation: ScreenNavigationProp<T>;
  channelName: string;
  clientProfile: ClientRole;

  setClientProfile: React.Dispatch<React.SetStateAction<ClientRole>>;
};

export const Conference: React.FC<Props<'Conference'>> = ({
  channelName,
  clientProfile,

  setClientProfile,
}) => {
  const navigation = useNavigation<any>();

  const [peerIds, setPeerIds] = useState<number[]>([]);
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const engine = useRef<RtcEngine>();

  const initAgoraEngine = useCallback(
    async function () {
      engine.current = await RtcEngine.create(REACT_APP_APP_ID);

      await engine.current?.enableVideo();

      await engine.current?.setChannelProfile(ChannelProfile.LiveBroadcasting);

      await engine.current?.setClientRole(clientProfile);

      engine.current?.addListener('Warning', warn =>
        console.log(`Warning ${warn}`),
      );

      engine.current?.addListener('Error', err => console.log(`Error ${err}`));

      engine.current?.addListener('UserJoined', uid => {
        if (peerIds.indexOf(uid) !== -1) return;

        setPeerIds(prevState => [...prevState, uid]);
      });

      engine.current?.addListener('UserOffline', uid => {
        setPeerIds(prevState => [...prevState.filter(id => id !== uid)]);
      });

      engine.current?.addListener('JoinChannelSuccess', () => {
        setJoinSucceed(true);
      });
    },
    [clientProfile, peerIds],
  );

  const onStartCall = useCallback(
    async function () {
      await engine.current?.joinChannel(undefined, channelName, null, 0);
    },
    [channelName],
  );

  async function onToggleRoll(toggleHost: ClientRole) {
    setClientProfile(toggleHost);

    await engine.current?.setClientRole(toggleHost);
  }

  async function onEndCall() {
    await engine.current?.leaveChannel();

    await engine.current?.destroy();

    setPeerIds([]);

    setJoinSucceed(false);

    navigation.navigate('Home');
  }

  useEffect(() => {
    if (isMounted) return;

    setIsMounted(true);

    initAgoraEngine().then(onStartCall);
  }, [initAgoraEngine, isMounted, onStartCall]);

  return (
    <SafeAreaView style={styles.ConferenceMainView}>
      <Text style={styles.RoleText}>
        You are
        {clientProfile === ClientRole.Broadcaster
          ? ' a broadcaster'
          : ' The audience'}
      </Text>

      {joinSucceed ? (
        <Videos
          isHost={clientProfile === ClientRole.Broadcaster}
          channelName={channelName}
          peerIds={peerIds}
        />
      ) : undefined}

      <View style={styles.ButtonHolder}>
        <TouchableOpacity
          onPress={() =>
            onToggleRoll(
              clientProfile === ClientRole.Audience
                ? ClientRole.Broadcaster
                : ClientRole.Audience,
            )
          }
          style={styles.Button()}>
          <Text style={styles.ButtonText}>
            {clientProfile === ClientRole.Broadcaster
              ? 'Be an audience'
              : 'Be the host'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onEndCall} style={styles.Button('red')}>
          <Text style={styles.ButtonText}>End Call</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create<any>({
  ConferenceMainView: {
    flex: 1,
    backgroundColor: 'black',
  },
  RoleText: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 18,
    color: '#fff',
  },
  ButtonHolder: {
    height: 100,
    position: 'absolute',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    bottom: 30,
  },
  Button: (color = '#0093E9') => ({
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: color,
    borderRadius: 25,
  }),
  ButtonText: {
    color: '#fff',
  },
});
