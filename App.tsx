import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import { ClientRole } from 'react-native-agora';

import { Home } from './src/screens/home/component';
import { PermissionUtils } from './src/utils/permissions';
import { Conference } from './src/screens/conference/component';

export type RootStackParamList = {
  Home: undefined;
  Conference: undefined;
};

type StackOptions =
  | StackNavigationOptions
  | ((props: {
      route: RouteProp<Record<string, object | undefined>, 'Home'>;
      navigation: any;
    }) => StackNavigationOptions)
  | undefined;

const Stack = createStackNavigator();

export const RADIO_PROPS = [
  { label: 'Audience', value: ClientRole.Audience },
  { label: 'Broadcaster', value: ClientRole.Broadcaster },
];

const App = () => {
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [clientProfile, setClientProfile] = useState(RADIO_PROPS[0].value);

  const options: StackOptions = {
    headerShown: false,
  };

  const getAccessGrant = useCallback(async () => {
    const isGranted = await PermissionUtils.requestCameraAndAudioPermission();

    setIsAccessGranted(!!isGranted);
  }, [setIsAccessGranted]);

  useEffect(() => {
    getAccessGrant();
  }, [getAccessGrant]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={options}>
          {props => (
            <Home
              {...props}
              channelName={channelName}
              isAccessGranted={isAccessGranted}
              clientProfile={clientProfile}
              setIsAccessGranted={setIsAccessGranted}
              setChannelName={setChannelName}
              setClientProfile={setClientProfile}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Conference" options={options}>
          {props => (
            <Conference
              {...props}
              channelName={channelName}
              clientProfile={clientProfile}
              setClientProfile={setClientProfile}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
