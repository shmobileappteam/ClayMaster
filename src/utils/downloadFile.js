import { Alert } from 'react-native';
import { PermissionsAndroid, Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

export const downloadFile = async (fileUrl, fileName) => {
  try {
    if (Platform.OS === 'android') {
      const apiLevel = Platform.Version;

      if (apiLevel < 29) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to storage to download files',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Denied',
            'Storage permission is required to download files',
          );
          return;
        }
      }
    }

    const { dirs } = ReactNativeBlobUtil.fs;
    const downloadDir = Platform.select({
      ios: dirs.DocumentDir,
      android: dirs.DownloadDir,
    });
    const filePath = `${downloadDir}/${fileName}`;

    Alert.alert('Download Started', `${fileName} is being downloaded...`);

    const config = {
      fileCache: true,
      path: filePath,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: fileName,
        description: 'File download',
        mime: 'application/octet-stream',
        path: filePath,
      },
    };

    const response = await ReactNativeBlobUtil.config(config)

      .fetch('GET', fileUrl)
      .progress((received, total) => {
        console.log(`Progress: ${Math.floor((received / total) * 100)}%`);
      });

    if (Platform.OS === 'ios') {
      ReactNativeBlobUtil.ios.previewDocument(response.path());
    } else {
      Alert.alert('Download Complete', `File saved to Downloads folder`, [
        {
          text: 'Open',
          onPress: () => {
            // For Android, we can use ACTION_VIEW intent
            ReactNativeBlobUtil.android.actionViewIntent(
              response.path(),
              'application/octet-stream',
            );
          },
        },
        { text: 'OK', style: 'cancel' },
      ]);
    }
  } catch (error) {
    Alert.alert('Download Failed', error.message);
  }
};
