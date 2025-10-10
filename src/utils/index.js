import { Platform, StatusBar } from 'react-native';
import { showMessage as flashMessage } from 'react-native-flash-message';

export function showMessage({
  message = '',
  type = 'default',
  bgColor = '',
  position = null,
}) {
  const backgroundColor =
    bgColor ||
    (type === 'success'
      ? '#38E54D'
      : type === 'danger'
      ? '#CD1818'
      : '#999999');

  flashMessage({
    message: message,
    type: type,
    backgroundColor: backgroundColor,
    statusBarHeight: StatusBar.currentHeight,
    position: position || 'center',
  });

  if (Platform.OS == 'android') {
    StatusBar.setBackgroundColor(backgroundColor);
    StatusBar.setBarStyle('light-content');
  }
}
export const formatBackendErrors = errors => {
  const errObj = {};

  if (errors && typeof errors === 'object') {
    Object.entries(errors).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        errObj[key] = value[0];
      }
    });
  }

  return errObj;
};

export const objectToFormData = (
  obj,
  formData = new FormData(),
  parentKey = '',
) => {
  Object.entries(obj).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return; // Skip null/undefined values
    }

    const currentKey = parentKey ? `${parentKey}[${key}]` : key;

    if (Array.isArray(value)) {
      // Handle array of files or values
      value.forEach((item, index) => {
        const arrayKey = `${currentKey}[${index}]`;

        if (typeof item === 'object' && item?.uri) {
          // File object in array
          formData.append(arrayKey, {
            uri: item.uri,
            type: item.type,
            name: item.fileName,
          });
        } else {
          // Primitive value in array
          formData.append(arrayKey, item);
        }
      });
    } else if (typeof value === 'object' && value?.uri) {
      // Single file object
      formData.append(currentKey, {
        uri: value.uri,
        type: value.type,
        name: value.fileName,
      });
    } else {
      // Primitive value
      formData.append(currentKey, value);
    }
  });

  return formData;
};

export const maskPhoneNumber = input => {
  if (!input) return;
  // Remove all non-numeric characters from the input and take only 10 first digits
  const digits = input.replace(/\D/g, '').slice(0, 10);

  // Return empty string if there are no digits
  if (digits.length === 0) return '';

  let formattedPhoneNumber = '';

  // Apply different formats based on digit length
  if (digits.length <= 3) {
    // Format for 1-3 digits
    formattedPhoneNumber = digits;
  } else if (digits.length <= 6) {
    // Format for 4-6 digits as AAA-BBB
    formattedPhoneNumber = digits.replace(/(\d{3})(\d+)/, '$1-$2');
  } else {
    // Format for 7-10 digits as AAA-BBB-CCCC
    formattedPhoneNumber = digits.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
  }

  return formattedPhoneNumber;
};

export const formatDate = isoDate => {
  const date = new Date(isoDate);
  const day = date.getDate();
  const month = date.getMonth() + 1; // months are 0-indexed
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

// ✅ Function to generate pairOfTargets dynamically

export const generatePairOfTargets = idsArray => {
  const result = {};

  idsArray.forEach(id => {
    const shots = Array.from({ length: id * 2 }, (_, i) => ({
      sequence: i + 1,
      result: 'empty',
    }));
    result[id] = shots;
  });

  return result;
};
