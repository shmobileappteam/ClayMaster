import {useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';

const useImagePicker = (handleChange = () => {}) => {
  const [imageUri, setImageUri] = useState(null);
  const [error, setError] = useState(null);

  const options = {
    mediaType: 'photo',
    includeBase64: false,
    maxHeight: 2000,
    maxWidth: 3000,
  };

  const isValidImageType = uri => {
    const fileExtension = uri.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png'].includes(fileExtension);
  };

  const openGallery = () => {
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        // setError('User cancelled image picker');
      } else if (response.errorCode) {
        setError(`Image Picker Error: ${response.errorCode}`);
      } else {
        const imageUri = response.assets?.[0]?.uri || response.uri;

        if (isValidImageType(imageUri)) {
          setImageUri(response.assets?.[0]);
          handleChange(imageUri);
          setError(null);
        } else {
          setError(
            'Invalid image type. Please select a jpg, jpeg, or png file.',
          );
        }
      }
    });
  };

  return {
    imageUri,
    error,
    openGallery,
    clearImage: () => setImageUri(null),
  };
};

export default useImagePicker;
