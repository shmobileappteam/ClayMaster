// import { Alert } from 'react-native';
// import { PermissionsAndroid, Platform } from 'react-native';
// import ReactNativeBlobUtil from 'react-native-blob-util';

// export const downloadFile = async (fileUrl, fileName) => {
//   try {
//     if (Platform.OS === 'android') {
//       const apiLevel = Platform.Version;

//       if (apiLevel < 29) {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           {
//             title: 'Storage Permission',
//             message: 'App needs access to storage to download files',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           },
//         );
//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//           Alert.alert(
//             'Permission Denied',
//             'Storage permission is required to download files',
//           );
//           return;
//         }
//       }
//     }

//     const { dirs } = ReactNativeBlobUtil.fs;

//     const downloadDir = Platform.select({
//       ios: dirs.DocumentDir,
//       android: `/storage/emulated/0/Download`,
//     });
//     const filePath = `${downloadDir}/${fileName}`;

//     Alert.alert('Download Started', `${fileName} is being downloading...`);
//     console.log(
//       '🚀 ~ downloadFile.js:37 ~ downloadFile ~ filePath:',
//       filePath,
//       fileUrl,
//     );

//     const config = {
//       overwrite: true,
//       fileCache: true,
//       path: filePath,
//       addAndroidDownloads: {
//         useDownloadManager: true,
//         notification: true,
//         title: fileName,
//         description: 'File download',
//         // mime: 'application/octet-stream', // OLD CODE
//         mime: 'application/vnd.ms-excel', // use to open xls apps to show files
//         path: filePath,
//       },
//     };

//     console.log('🚀 ~ downloadFile.js:61 ~ downloadFile ~ config:', config);
//     const response = await ReactNativeBlobUtil.config(config)
//       .fetch('GET', fileUrl, {
//         // some servers need this
//         Accept: 'application/vnd.ms-excel',
//       })
//       .progress((received, total) => {
//         console.log(`Progress: ${Math.floor((received / total) * 100)}%`);
//       });
//     console.log(
//       '🚀 ~ downloadFile.js:65 ~ downloadFile ~ response:',
//       response.path(),
//     );

//     if (Platform.OS === 'ios') {
//       ReactNativeBlobUtil.ios.previewDocument(response.path());
//     } else {
//       Alert.alert('Download Complete', `File saved to Downloads folder`, [
//         {
//           text: 'Open',
//           onPress: () => {
//             // For Android, we can use ACTION_VIEW intent
//             ReactNativeBlobUtil.android.actionViewIntent(
//               response.path(),
//               // 'application/octet-stream', // old code
//               'application/vnd.ms-excel',
//             );
//           },
//         },
//         { text: 'OK', style: 'cancel' },
//       ]);
//     }
//   } catch (error) {
//     Alert.alert('Download Failed', error.message);
//   }
// };
