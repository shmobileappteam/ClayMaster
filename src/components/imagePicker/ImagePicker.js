// import React from 'react';
// import {View, StyleSheet, TouchableOpacity} from 'react-native';
// import {launchImageLibrary} from 'react-native-image-picker';

// import {COLORS} from '../../globalStyle/Theme';
// import Icon from '../../helpers/Icon';
// import Sizer from '../../helpers/Sizer';
// import Typography from '../../atomComponents/Typography';

// const ImagePicker = ({setImages = () => {}}) => {
//   const pickImage = props => {
//     launchImageLibrary(
//       {mediaType: 'photo', includeBase64: false, selectionLimit: 0},
//       response => {
//         if (response.didCancel) {
//           console.log('User cancelled image picker');
//         } else if (response.error) {
//           console.log('ImagePicker Error: ', response.error);
//         } else {
//           const source = response.assets;
//           setImages(source);
//         }
//       },
//     );
//   };

//   return (
//     <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
//       <View style={[styles.container]}>
//         <Icon
//           name="upload-cloud"
//           iconFamily={'Feather'}
//           color={COLORS.secondary}
//           size={30}
//         />
//         <Typography size={12} mT={10} color={COLORS.greyV1}>
//           Choose files to upload
//         </Typography>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 2,
//     borderColor: COLORS.greyV1,
//     borderStyle: 'dashed',
//     borderRadius: 12,
//     height: Sizer.hSize(100),
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 12,
//   },
// });

// export default ImagePicker;
