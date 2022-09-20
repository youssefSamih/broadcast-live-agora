import { Platform } from 'react-native';
import {
  requestMultiple,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

const requestCameraAndAudioPermission = async () => {
  try {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return false;

    if (Platform.OS === 'ios') {
      const granted = await requestMultiple([
        PERMISSIONS.IOS.CAMERA,
        PERMISSIONS.IOS.MICROPHONE,
      ]);

      if (
        granted[PERMISSIONS.IOS.CAMERA] === RESULTS.GRANTED ||
        granted[PERMISSIONS.IOS.MICROPHONE] === RESULTS.GRANTED
      ) {
        return true;
      }

      return false;
    }

    if (Platform.OS === 'android') {
      const granted = await requestMultiple([
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.RECORD_AUDIO,
      ]);

      if (
        granted[PERMISSIONS.ANDROID.CAMERA] === RESULTS.GRANTED &&
        granted[PERMISSIONS.ANDROID.RECORD_AUDIO] === RESULTS.GRANTED
      ) {
        return true;
      }

      return false;
    }
  } catch (err) {
    return false;
  }
};

export const PermissionUtils = {
  requestCameraAndAudioPermission,
};
