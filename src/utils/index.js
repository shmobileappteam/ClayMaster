import { Platform, StatusBar } from 'react-native';
import { showMessage as flashMessage } from 'react-native-flash-message';
import { COLORS } from '../globalStyle/Theme';

/**
 * Top toast — parity with ClayMaster-App-UI `use-toast` / Sonner-style banners.
 *
 * @param {string} [message] - Primary line (or body when `title` is set)
 * @param {string} [title] - Headline (web `toast({ title, description })`)
 * @param {string} [description] - Secondary line
 * @param {'default'|'success'|'danger'|'card'} [type] - `card` = white library toast
 * @param {string} [bgColor] - Override background
 * @param {string} [color] - Override text color
 * @param {'top'|'bottom'|'center'} [position] - Defaults to `top` (web slides from top)
 */
export function showMessage({
  message = '',
  title = '',
  description = '',
  type = 'default',
  bgColor = '',
  color = '',
  position = 'top',
  duration = 3000,
}) {
  const isCardToast = type === 'card';

  const displayMessage = title || message;
  const displayDescription = title ? description || message : description;

  const backgroundColor = isCardToast
    ? COLORS.surface
    : bgColor ||
      (type === 'success'
        ? COLORS.primary
        : type === 'danger'
          ? '#CD1818'
          : COLORS.textPrimary);

  const textColor =
    color ||
    (isCardToast
      ? COLORS.textPrimary
      : type === 'success' || type === 'danger'
        ? COLORS.white100
        : COLORS.white100);

  flashMessage({
    message: displayMessage,
    description: displayDescription || undefined,
    type: isCardToast ? 'info' : type === 'default' ? 'info' : type,
    backgroundColor,
    color: textColor,
    statusBarHeight: StatusBar.currentHeight,
    position,
    duration,
    style: isCardToast
      ? {
          borderWidth: 1,
          borderColor: COLORS.borderMuted,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
          elevation: 6,
        }
      : undefined,
    titleStyle: isCardToast
      ? { fontFamily: 'Barlow-SemiBold', fontSize: 15, color: COLORS.textPrimary }
      : undefined,
    textStyle: isCardToast
      ? { fontFamily: 'Barlow-Regular', fontSize: 13, color: COLORS.textSecondary }
      : undefined,
  });

  if (Platform.OS === 'android' && !isCardToast) {
    StatusBar.setBackgroundColor(backgroundColor);
    StatusBar.setBarStyle(type === 'success' ? 'light-content' : 'light-content');
  }
}

/** Web-style `{ title, description }` toast shorthand */
export function showToast({ title, description, type = 'card', duration = 3000 }) {
  showMessage({ title, description, type, duration });
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
  const date = isoDate ? new Date(isoDate) : new Date();
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

export const formatUsDate = dateLike => {
  const d = dateLike ? new Date(dateLike) : new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

export const formatExpiryDate = (expiryString) => {
  if (!expiryString) return '';

  // Parse the date (handles "2025-11-28 00:00:00" format)
  const date = new Date(expiryString.replace(' ', 'T') + 'Z');

  if (isNaN(date.getTime())) return 'Invalid date';

  const now = new Date();
  const diffTime = date - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Show countdown if expiring soon, otherwise full date
  if (diffDays <= 7) {
    return `${diffDays} days left`;
  } else if (diffDays <= 30) {
    return `${Math.floor(diffDays / 7)} weeks left`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};
