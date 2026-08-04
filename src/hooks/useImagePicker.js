import { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { showMessage } from '../utils';

/**
 * Gallery picker for profile / attachment photos (ZoomGo-aligned).
 * Returns the picked asset (`uri`, `fileName`, `type`) for multipart upload.
 */
const useImagePicker = (handleChange = () => {}) => {
  const [imageUri, setImageUri] = useState(null);
  const [error, setError] = useState(null);

  const options = {
    mediaType: 'photo',
    includeBase64: false,
    maxHeight: 2000,
    maxWidth: 3000,
    selectionLimit: 1,
    presentationStyle: 'fullScreen',
  };

  const isValidImage = asset => {
    if (!asset?.uri) return false;

    const mime = String(asset.type ?? '').toLowerCase();
    if (mime.startsWith('image/')) {
      return (
        mime.includes('jpeg') || mime.includes('jpg') || mime.includes('png')
      );
    }

    const name = String(asset.fileName ?? asset.uri).toLowerCase();
    const ext = name.split('.').pop()?.split('?')[0];
    return ['jpg', 'jpeg', 'png'].includes(ext);
  };

  const openGallery = () => {
    launchImageLibrary(options, response => {
      if (response.didCancel) return;

      if (response.errorCode) {
        const message = `Image Picker Error: ${response.errorCode}`;
        setError(message);
        showMessage({ type: 'danger', message });
        return;
      }

      const asset = response.assets?.[0] ?? null;
      if (!asset?.uri) return;

      if (!isValidImage(asset)) {
        const message =
          'Invalid image type. Please select a jpg, jpeg, or png file.';
        setError(message);
        showMessage({ type: 'warning', message });
        return;
      }

      setImageUri(asset);
      handleChange(asset.uri);
      setError(null);
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
