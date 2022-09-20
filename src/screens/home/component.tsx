import React, { useState, createRef } from 'react';
import type { StackNavigationProp } from '@react-navigation/stack';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  Alert,
} from 'react-native';
import { openSettings } from 'react-native-permissions';
import { useNavigation } from '@react-navigation/native';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import { ClientRole } from 'react-native-agora';

import { RADIO_PROPS, RootStackParamList } from '../../../App';
import { PermissionUtils } from '../../utils/permissions';

type ScreenNavigationProp<T extends keyof RootStackParamList> =
  StackNavigationProp<RootStackParamList, T>;

type Props<T extends keyof RootStackParamList> = {
  navigation: ScreenNavigationProp<T>;
  isAccessGranted: boolean;
  channelName: string;
  clientProfile: ClientRole;

  setIsAccessGranted: React.Dispatch<React.SetStateAction<boolean>>;
  setChannelName: React.Dispatch<React.SetStateAction<string>>;
  setClientProfile: React.Dispatch<React.SetStateAction<ClientRole>>;
};

export const Home: React.FC<Props<'Home'>> = ({
  isAccessGranted,
  channelName,
  clientProfile,

  setIsAccessGranted,
  setChannelName,
  setClientProfile,
}) => {
  const navigation = useNavigation<any>();

  const [errorText, setErrorText] = useState('');

  const agoraAppIdInputRef = createRef<TextInput>();

  async function onSubmit() {
    if (channelName?.trim().length === 0) {
      setErrorText('You must provide channel name');

      return;
    }

    setErrorText('');

    if (!isAccessGranted) {
      const isPermissionGranted =
        await PermissionUtils.requestCameraAndAudioPermission();

      if (!isPermissionGranted) {
        return Alert.alert(
          'Camera and record audio Permission',
          'You should allow using camera and record audio!',
          [
            {
              text: 'Cancel',
              onPress: () =>
                setErrorText(
                  'You should allow using camera and record audio !',
                ),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () =>
                openSettings().catch(() =>
                  Alert.alert(
                    'cannot open settings you can set permissions manually from settings',
                  ),
                ),
            },
          ],
        );
      }

      isPermissionGranted && setIsAccessGranted(isPermissionGranted);
    }

    navigation.navigate('Conference');
  }

  return (
    <SafeAreaView style={styles.MainBody}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.ScrollViewContentContainerStyle}>
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={Platform.select({ ios: 30, android: 0 })}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <View style={styles.LogoView}>
                <Text style={styles.TextLogo}>LIVE BROADCAST</Text>
              </View>

              <View style={styles.SectionStyle}>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={evt => setChannelName(evt)}
                  placeholder="Channel name"
                  placeholderTextColor="#c8deff"
                  cursorColor="#fff"
                  underlineColorAndroid="#f000"
                  ref={agoraAppIdInputRef}
                  value={channelName}
                  onSubmitEditing={Keyboard.dismiss}
                />
              </View>

              <View style={styles.SectionStyle}>
                <RadioForm onPress={setClientProfile} formHorizontal>
                  {RADIO_PROPS.map(obj => (
                    <RadioButton labelHorizontal={true} key={obj.value}>
                      <RadioButtonInput
                        obj={obj}
                        index={obj.value}
                        isSelected={clientProfile === obj.value}
                        onPress={setClientProfile}
                        buttonInnerColor={
                          clientProfile === obj.value ? '#93ff60' : '#307ecc'
                        }
                        buttonOuterColor="#dadae8"
                        buttonSize={20}
                        buttonWrapStyle={styles.ButtonWrapStyle}
                      />

                      <RadioButtonLabel
                        obj={obj}
                        index={obj.value}
                        labelHorizontal={true}
                        onPress={setClientProfile}
                        labelStyle={styles.LabelStyle}
                      />
                    </RadioButton>
                  ))}
                </RadioForm>
              </View>

              {errorText !== '' ? (
                <Text style={styles.errorTextStyle}>{errorText}</Text>
              ) : undefined}

              <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={onSubmit}>
                <Text style={styles.buttonTextStyle}>Start conference</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  LabelStyle: {
    fontSize: 20,
    color: 'white',
  },
  ButtonWrapStyle: {
    marginLeft: 25,
  },
  TextLogo: {
    fontSize: 25,
    fontWeight: '900',
    color: 'white',
  },
  LogoView: {
    alignItems: 'center',
    marginBottom: 15,
  },
  ScrollViewContentContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  MainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#307ecc',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
  errorTextStyle: {
    color: '#f00',
    textAlign: 'center',
    fontSize: 14,
  },
  buttonStyle: {
    backgroundColor: '#7DE24E',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
});
